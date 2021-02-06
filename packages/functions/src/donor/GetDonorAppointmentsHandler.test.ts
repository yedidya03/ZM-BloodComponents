import firebaseFunctionsTest from "../testUtils/FirebaseTestUtils";
import {
  DbAppointment,
  FunctionsApi,
  Hospital,
} from "@zm-blood-components/common";
import * as Functions from "../index";
import { deleteDonor } from "../dal/DonorDataAccessLayer";
import {
  deleteAppointmentsByIds,
  setAppointment,
} from "../dal/AppointmentDataAccessLayer";
import { expectAsyncThrows, getDate } from "../testUtils/TestUtils";
import * as admin from "firebase-admin";
import { saveTestDonor } from "../testUtils/TestSamples";

const wrapped = firebaseFunctionsTest.wrap(Functions.getDonorAppointments);

const CREATING_USER_ID = "GetDonorAppointmentsHandlerCreatingUserId";
const DONOR_ID = "GetDonorAppointmentsHandlerDonorId";
const FUTURE_APPOINTMENT_1 = "GetDonorAppointmentsHandlerAppointment1";
const PAST_APPOINTMENT_1 = "GetDonorAppointmentsHandlerAppointment2";
const FUTURE_APPOINTMENT_2 = "GetDonorAppointmentsHandlerAppointment3";
const PAST_APPOINTMENT_2 = "GetDonorAppointmentsHandlerAppointment4";

const ALL_TEST_APPOINTMENTS_IDS = [
  FUTURE_APPOINTMENT_1,
  PAST_APPOINTMENT_1,
  FUTURE_APPOINTMENT_2,
  PAST_APPOINTMENT_2,
];

beforeAll(reset);
afterEach(reset);

async function reset() {
  await deleteDonor(DONOR_ID);
  await deleteAppointmentsByIds(ALL_TEST_APPOINTMENTS_IDS);
}

test("Donor not found throws exception", async () => {
  const action = () =>
    callTarget({
      donorId: DONOR_ID,
      fromMillis: getDate(-1).getTime(),
      toMillis: getDate(1).getTime(),
    });

  await expectAsyncThrows(action, "Donor not found");
});

test("No appointments returns empty response", async () => {
  await saveTestDonor(DONOR_ID);

  const result = await callTarget({
    donorId: DONOR_ID,
    fromMillis: getDate(-1).getTime(),
    toMillis: getDate(1).getTime(),
  });

  expect(result.completedAppointments).toHaveLength(0);
  expect(result.futureAppointments).toHaveLength(0);
});

test("Only appointment in time frame are returned", async () => {
  await saveTestDonor(DONOR_ID);
  const oneWeekAgo = getDate(-7);
  const yesterday = getDate(-1);
  const tomorrow = getDate(1);
  const inOneWeek = getDate(7);

  await saveAppointment(FUTURE_APPOINTMENT_1, tomorrow);
  await saveAppointment(FUTURE_APPOINTMENT_2, inOneWeek);
  await saveAppointment(PAST_APPOINTMENT_1, oneWeekAgo);
  await saveAppointment(PAST_APPOINTMENT_2, yesterday);

  const result = await callTarget({
    donorId: DONOR_ID,
    fromMillis: getDate(-3).getTime(),
    toMillis: getDate(3).getTime(),
  });

  expect(result.completedAppointments).toHaveLength(1);
  expect(result.completedAppointments[0].id).toEqual(PAST_APPOINTMENT_2);
  expect(result.completedAppointments[0].donationStartTimeMillis).toEqual(
    yesterday.getTime()
  );

  expect(result.futureAppointments).toHaveLength(1);
  expect(result.futureAppointments[0].id).toEqual(FUTURE_APPOINTMENT_1);
  expect(result.futureAppointments[0].donationStartTimeMillis).toEqual(
    tomorrow.getTime()
  );
});

test("All appointment are returned in order", async () => {
  await saveTestDonor(DONOR_ID);
  const oneWeekAgo = getDate(-7);
  const yesterday = getDate(-1);
  const tomorrow = getDate(1);
  const inOneWeek = getDate(7);

  await saveAppointment(FUTURE_APPOINTMENT_1, inOneWeek);
  await saveAppointment(FUTURE_APPOINTMENT_2, tomorrow);
  await saveAppointment(PAST_APPOINTMENT_1, oneWeekAgo);
  await saveAppointment(PAST_APPOINTMENT_2, yesterday);

  const result = await callTarget({
    donorId: DONOR_ID,
  });

  expect(result.completedAppointments).toHaveLength(2);
  expect(result.completedAppointments[0].id).toEqual(PAST_APPOINTMENT_1);
  expect(result.completedAppointments[1].id).toEqual(PAST_APPOINTMENT_2);

  expect(result.futureAppointments).toHaveLength(2);
  expect(result.futureAppointments[0].id).toEqual(FUTURE_APPOINTMENT_2);
  expect(result.futureAppointments[1].id).toEqual(FUTURE_APPOINTMENT_1);
});

async function callTarget(request: FunctionsApi.GetDonorAppointmentsRequest) {
  return (await wrapped(request, {
    auth: {
      uid: DONOR_ID,
    },
  })) as FunctionsApi.GetDonorAppointmentsResponse;
}

async function saveAppointment(id: string, donationStartTime: Date) {
  const appointment: DbAppointment = {
    id: id,
    creationTime: admin.firestore.Timestamp.fromDate(donationStartTime),
    creatorUserId: CREATING_USER_ID,
    donationStartTime: admin.firestore.Timestamp.fromDate(donationStartTime),
    hospital: Hospital.ASAF_HAROFE,
    donorId: DONOR_ID,
    bookingTime: admin.firestore.Timestamp.now(),
  };

  await setAppointment(appointment);
  return appointment;
}