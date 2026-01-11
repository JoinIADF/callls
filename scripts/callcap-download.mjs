#!/usr/bin/env node
import { createWriteStream } from 'node:fs';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { pipeline } from 'node:stream/promises';
import { Readable } from 'node:stream';

const DEFAULT_CONFIG_PATH = 'callcap.config.json';

const args = process.argv.slice(2);
const argMap = new Map();
for (let i = 0; i < args.length; i += 1) {
  const arg = args[i];
  if (arg.startsWith('--')) {
    const key = arg.slice(2);
    const value = args[i + 1] && !args[i + 1].startsWith('--') ? args[i + 1] : 'true';
    argMap.set(key, value);
    if (value !== 'true') i += 1;
  }
}

if (argMap.has('help')) {
  console.log(`Callcap downloader\n\n` +
    `Usage:\n` +
    `  node scripts/callcap-download.mjs --config callcap.config.json --from 2024-01-01 --to 2024-01-31 --output downloads\n\n` +
    `Environment:\n` +
    `  Use env vars in the config (ex: { \"auth\": { \"value\": \"Bearer \\${CALLCAP_API_KEY}\" } })\n`);
  process.exit(0);
}

const configPath = argMap.get('config') || DEFAULT_CONFIG_PATH;
const fromDate = argMap.get('from') || null;
const toDate = argMap.get('to') || null;
const outputDir = argMap.get('output') || 'callcap-downloads';
const limit = argMap.get('limit') ? Number(argMap.get('limit')) : null;

const rawConfig = await readFile(configPath, 'utf-8');
const config = JSON.parse(substituteEnv(rawConfig));

const baseUrl = config.baseUrl?.replace(/\/$/, '') || '';
if (!baseUrl) {
  throw new Error('Config missing baseUrl');
}

const authHeader = config.auth?.header;
const authValue = config.auth?.value;

const headers = new Headers(config.headers || {});
if (authHeader && authValue) {
  headers.set(authHeader, authValue);
}

await mkdir(outputDir, { recursive: true });
const audioDir = path.join(outputDir, 'audio');
await mkdir(audioDir, { recursive: true });
const metadataPath = path.join(outputDir, config.output?.metadataFile || 'calls.jsonl');

const calls = [];
let fetched = 0;
let page = config.list?.pagination?.start ?? 1;
let cursor = config.list?.pagination?.cursorStart ?? null;

while (true) {
  const query = buildQuery(config.list?.query || {}, { from: fromDate, to: toDate, page, cursor });
  const listUrl = new URL(`${baseUrl}${config.list?.endpoint || ''}`);
  for (const [key, value] of Object.entries(query)) {
    if (value != null && value !== '') listUrl.searchParams.set(key, String(value));
  }
  const response = await fetch(listUrl, { headers });
  if (!response.ok) {
    throw new Error(`Failed to list calls: ${response.status} ${response.statusText}`);
  }
  const payload = await response.json();
  const items = getPath(payload, config.list?.itemsPath || '') || payload;
  if (!Array.isArray(items)) {
    throw new Error('List response did not contain an array of calls');
  }

  for (const call of items) {
    calls.push(call);
    fetched += 1;
    if (limit && fetched >= limit) break;
  }

  if (limit && fetched >= limit) break;

  const pagination = config.list?.pagination || {};
  if (pagination.type === 'cursor') {
    cursor = getPath(payload, pagination.nextPath || 'nextCursor');
    if (!cursor) break;
  } else if (pagination.type === 'page') {
    const nextPage = pagination.nextPath ? getPath(payload, pagination.nextPath) : null;
    if (nextPage) {
      page = nextPage;
    } else if (items.length === 0) {
      break;
    } else {
      page += 1;
    }
  } else {
    break;
  }
}

const metadataLines = [];
for (const call of calls) {
  const callId = call?.[config.recording?.idField || 'id'];
  if (!callId) continue;

  const recordingUrl = buildRecordingUrl(baseUrl, config.recording, call);
  const fileName = buildFileName(
    config.recording?.filenameTemplate || '{id}.mp3',
    call,
    config.recording?.idField || 'id',
  );
  const filePath = path.join(audioDir, sanitizeFilename(fileName));

  await downloadRecording(recordingUrl, headers, filePath, config.recording);

  metadataLines.push(JSON.stringify({
    id: callId,
    downloadedAt: new Date().toISOString(),
    recordingPath: path.relative(outputDir, filePath),
    call,
  }));
}

await writeLines(metadataPath, metadataLines);
console.log(`Downloaded ${metadataLines.length} calls to ${outputDir}`);

function substituteEnv(input) {
  return input.replace(/\$\{(\w+)\}/g, (_, name) => process.env[name] ?? '');
}

function buildQuery(template, params) {
  const query = {};
  for (const [key, value] of Object.entries(template)) {
    if (typeof value === 'string') {
      query[key] = value
        .replaceAll('{from}', params.from ?? '')
        .replaceAll('{to}', params.to ?? '')
        .replaceAll('{page}', params.page ?? '')
        .replaceAll('{cursor}', params.cursor ?? '');
    } else {
      query[key] = value;
    }
  }
  return query;
}

function getPath(obj, pathValue) {
  if (!pathValue) return null;
  return pathValue.split('.').reduce((acc, key) => (acc ? acc[key] : null), obj);
}

function buildRecordingUrl(baseUrlValue, recordingConfig, call) {
  const template = recordingConfig?.endpointTemplate || '';
  const endpoint = template.replaceAll('{id}', call?.[recordingConfig?.idField || 'id']);
  return `${baseUrlValue}${endpoint}`;
}

function buildFileName(template, call, idField) {
  return template.replaceAll('{id}', call?.[idField] ?? 'recording');
}

function sanitizeFilename(name) {
  return name.replace(/[^a-zA-Z0-9._-]/g, '_');
}

async function downloadRecording(recordingUrl, requestHeaders, filePath, recordingConfig) {
  const response = await fetch(recordingUrl, { headers: requestHeaders });
  if (!response.ok) {
    throw new Error(`Failed to download recording: ${response.status} ${response.statusText}`);
  }

  if (recordingConfig?.urlPath) {
    const payload = await response.json();
    const actualUrl = getPath(payload, recordingConfig.urlPath);
    if (!actualUrl) {
      throw new Error('Recording URL missing from response');
    }
    await downloadBinary(actualUrl, requestHeaders, filePath);
    return;
  }

  await streamToFile(response, filePath);
}

async function downloadBinary(url, requestHeaders, filePath) {
  const response = await fetch(url, { headers: requestHeaders });
  if (!response.ok) {
    throw new Error(`Failed to download recording binary: ${response.status} ${response.statusText}`);
  }
  await streamToFile(response, filePath);
}

async function streamToFile(response, filePath) {
  if (!response.body) {
    const buffer = Buffer.from(await response.arrayBuffer());
    await writeFile(filePath, buffer);
    return;
  }
  const nodeStream = Readable.fromWeb(response.body);
  await pipeline(nodeStream, createWriteStream(filePath));
}

async function writeLines(filePath, lines) {
  const handle = createWriteStream(filePath, { flags: 'w' });
  for (const line of lines) {
    handle.write(`${line}\n`);
  }
  await new Promise((resolve, reject) => {
    handle.end(resolve);
    handle.on('error', reject);
  });
}
