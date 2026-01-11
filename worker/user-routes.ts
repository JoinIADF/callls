import { Hono } from "hono";
import type { Env } from './core-utils';
import { StaffEntity, MeetAndGreetEntity, EngagementEntity, ObservationEntity, DogEntity, ShiftReportEntity } from "./entities";
import { ok, bad, notFound } from './core-utils';
import { MeetAndGreet, Engagement, Observation, ShiftReport } from "@shared/types";
export function userRoutes(app: Hono<{ Bindings: Env }>) {
  // Ensure seed data is present on first load
  app.use('/api/*', async (c, next) => {
    await Promise.all([
      StaffEntity.ensureSeed(c.env),
      MeetAndGreetEntity.ensureSeed(c.env),
      DogEntity.ensureSeed(c.env),
    ]);
    await next();
  });
  // STAFF & DOG ROUTES (supporting data)
  app.get('/api/staff', async (c) => {
    const page = await StaffEntity.list(c.env);
    return ok(c, page.items);
  });
  app.get('/api/dogs', async (c) => {
    const page = await DogEntity.list(c.env);
    return ok(c, page.items);
  });
  // MEET & GREET ROUTES
  app.get('/api/meet-and-greets', async (c) => {
    const page = await MeetAndGreetEntity.list(c.env);
    return ok(c, page.items);
  });
  app.post('/api/meet-and-greets', async (c) => {
    const body = await c.req.json<Partial<MeetAndGreet>>();
    if (!body.petName || !body.ownerName || !body.greetDateTime || !body.staffId || !body.store) {
      return bad(c, 'Missing required fields for Meet & Greet');
    }
    const newMeetAndGreet: MeetAndGreet = {
      id: crypto.randomUUID(),
      petName: body.petName,
      ownerName: body.ownerName,
      greetDateTime: body.greetDateTime,
      status: body.status || 'Attended',
      converted: body.converted || false,
      staffId: body.staffId,
      notes: body.notes || '',
      store: body.store,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const created = await MeetAndGreetEntity.create(c.env, newMeetAndGreet);
    return ok(c, created);
  });
  app.put('/api/meet-and-greets/:id', async (c) => {
    const id = c.req.param('id');
    const body = await c.req.json<Partial<MeetAndGreet>>();
    const entity = new MeetAndGreetEntity(c.env, id);
    if (!await entity.exists()) {
      return notFound(c, 'Meet & Greet not found');
    }
    const updated = await entity.mutate(current => ({
      ...current,
      ...body,
      id: current.id, // ensure id is not changed
      updatedAt: new Date().toISOString(),
    }));
    return ok(c, updated);
  });
  // ENGAGEMENT ROUTES
  app.get('/api/engagements', async (c) => {
    const page = await EngagementEntity.list(c.env);
    return ok(c, page.items);
  });
  app.post('/api/engagements', async (c) => {
    const body = await c.req.json<Partial<Engagement>>();
    if (!body.parentName || !body.milestone || !body.feedbackCategory || !body.staffId || !body.store) {
      return bad(c, 'Missing required fields for Engagement');
    }
    const newEngagement: Engagement = {
      id: crypto.randomUUID(),
      parentName: body.parentName,
      milestone: body.milestone,
      feedbackCategory: body.feedbackCategory,
      notes: body.notes || '',
      staffId: body.staffId,
      store: body.store,
      createdAt: new Date().toISOString(),
    };
    const created = await EngagementEntity.create(c.env, newEngagement);
    return ok(c, created);
  });
  // OBSERVATION ROUTES
  app.get('/api/observations', async (c) => {
    const page = await ObservationEntity.list(c.env);
    return ok(c, page.items);
  });
  app.post('/api/observations', async (c) => {
    const body = await c.req.json<Partial<Observation>>();
    if (!body.dogId || !body.dogName || !body.observationType || !body.staffId || !body.store) {
      return bad(c, 'Missing required fields for Observation');
    }
    const newObservation: Observation = {
      id: crypto.randomUUID(),
      dogId: body.dogId,
      dogName: body.dogName,
      date: new Date().toISOString(),
      shift: body.shift || 'AM',
      observationType: body.observationType,
      notes: body.notes || '',
      staffId: body.staffId,
      store: body.store,
    };
    const created = await ObservationEntity.create(c.env, newObservation);
    return ok(c, created);
  });
  // SHIFT REPORT ROUTES
  app.get('/api/shift-reports', async (c) => {
    const page = await ShiftReportEntity.list(c.env);
    return ok(c, page.items);
  });
  app.post('/api/shift-reports', async (c) => {
    const body = await c.req.json<Partial<ShiftReport>>();
    if (!body.shiftLeadId || !body.store) {
        return bad(c, 'Missing required fields for Shift Report');
    }
    const newReport: ShiftReport = {
        id: crypto.randomUUID(),
        date: body.date || new Date().toISOString(),
        shiftLeadId: body.shiftLeadId,
        enrollmentAdds: body.enrollmentAdds || 0,
        enrollmentDrops: body.enrollmentDrops || 0,
        enrollmentPauses: body.enrollmentPauses || 0,
        newVisits: body.newVisits || 0,
        returnVisits: body.returnVisits || 0,
        issues: body.issues || '',
        staffHighlights: body.staffHighlights || '',
        capacity: body.capacity || 0,
        store: body.store,
    };
    const created = await ShiftReportEntity.create(c.env, newReport);
    return ok(c, created);
  });
}