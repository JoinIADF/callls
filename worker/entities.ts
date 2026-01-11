import { IndexedEntity } from "./core-utils";
import type { User, MeetAndGreet, Dog, Engagement, Observation, ShiftReport } from "@shared/types";
const MOCK_STAFF: User[] = [
  { id: 'user-1', name: 'Alice Johnson', role: 'front-desk', store: 'Ellisville' },
  { id: 'user-2', name: 'Bob Williams', role: 'shift-lead', store: 'Ellisville' },
  { id: 'user-3', name: 'Charlie Brown', role: 'manager', store: 'Rock Hill' },
  { id: 'user-4', name: 'Diana Miller', role: 'front-desk', store: 'Rock Hill' },
];
const MOCK_MEET_AND_GREETS: MeetAndGreet[] = [
    { id: 'mg-1', petName: 'Buddy', ownerName: 'John Doe', greetDateTime: new Date(Date.now() - 86400000).toISOString(), status: 'Attended', converted: true, staffId: 'user-1', notes: 'Very friendly golden retriever.', store: 'Ellisville', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: 'mg-2', petName: 'Lucy', ownerName: 'Jane Smith', greetDateTime: new Date(Date.now() - 172800000).toISOString(), status: 'Attended', converted: false, staffId: 'user-2', notes: 'A bit shy at first.', store: 'Ellisville', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: 'mg-3', petName: 'Max', ownerName: 'Peter Jones', greetDateTime: new Date().toISOString(), status: 'No-Show', converted: false, staffId: 'user-4', store: 'Rock Hill', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
];
const MOCK_DOGS: Dog[] = [
    { id: 'dog-1', name: 'Buddy', ownerName: 'John Doe', store: 'Ellisville', photoUrl: 'https://images.dog.ceo/breeds/retriever-golden/n02099601_3414.jpg' },
    { id: 'dog-2', name: 'Lucy', ownerName: 'Jane Smith', store: 'Ellisville', photoUrl: 'https://images.dog.ceo/breeds/beagle/n02088364_1213.jpg' },
    { id: 'dog-3', name: 'Max', ownerName: 'Peter Jones', store: 'Rock Hill', photoUrl: 'https://images.dog.ceo/breeds/germanlonghair/n02101388_283.jpg' },
    { id: 'dog-4', name: 'Daisy', ownerName: 'Susan White', store: 'Rock Hill', photoUrl: 'https://images.dog.ceo/breeds/poodle-miniature/n02113712_393.jpg' },
];
export class StaffEntity extends IndexedEntity<User> {
  static readonly entityName = "staff";
  static readonly indexName = "staff_all";
  static readonly initialState: User = { id: "", name: "", role: 'front-desk', store: 'Ellisville' };
  static seedData = MOCK_STAFF;
}
export class MeetAndGreetEntity extends IndexedEntity<MeetAndGreet> {
  static readonly entityName = "meetAndGreet";
  static readonly indexName = "meetAndGreets_all";
  static readonly initialState: MeetAndGreet = {
    id: "",
    petName: "",
    ownerName: "",
    greetDateTime: new Date().toISOString(),
    status: 'Attended',
    converted: false,
    staffId: "",
    store: 'Ellisville',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  static seedData = MOCK_MEET_AND_GREETS;
}
export class DogEntity extends IndexedEntity<Dog> {
  static readonly entityName = "dog";
  static readonly indexName = "dogs_all";
  static readonly initialState: Dog = { id: "", name: "", ownerName: "", store: 'Ellisville' };
  static seedData = MOCK_DOGS;
}
export class EngagementEntity extends IndexedEntity<Engagement> {
  static readonly entityName = "engagement";
  static readonly indexName = "engagements_all";
  static readonly initialState: Engagement = { id: "", parentName: "", milestone: '1 Month', feedbackCategory: 'Praise', notes: "", staffId: "", store: 'Ellisville', createdAt: new Date().toISOString() };
}
export class ObservationEntity extends IndexedEntity<Observation> {
  static readonly entityName = "observation";
  static readonly indexName = "observations_all";
  static readonly initialState: Observation = { id: "", dogId: "", dogName: "", date: new Date().toISOString(), shift: 'AM', observationType: 'Socialization', notes: "", staffId: "", store: 'Ellisville' };
}
export class ShiftReportEntity extends IndexedEntity<ShiftReport> {
  static readonly entityName = "shiftReport";
  static readonly indexName = "shiftReports_all";
  static readonly initialState: ShiftReport = { id: "", date: new Date().toISOString(), shiftLeadId: "", enrollmentAdds: 0, enrollmentDrops: 0, enrollmentPauses: 0, newVisits: 0, returnVisits: 0, issues: "", staffHighlights: "", capacity: 0, store: 'Ellisville' };
}