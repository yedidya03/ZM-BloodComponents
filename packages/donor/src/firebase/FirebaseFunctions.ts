import firebase from "firebase/app";
import "firebase/functions";
import {
  AvailableAppointment,
  BloodType,
  BookedAppointment,
  Donor,
  FunctionsApi,
} from "@zm-blood-components/common";

export function getAvailableAppointments() {
  const getAvailableAppointmentsFunction = firebase
    .functions()
    .httpsCallable(FunctionsApi.GetAvailableAppointmentsFunctionName);
  return getAvailableAppointmentsFunction().then((res) => {
    const response = res.data as FunctionsApi.GetAvailableAppointmentsResponse;
    return response.availableAppointments.map<AvailableAppointment>(
      (appointment) => ({
        id: appointment.id,
        donationStartTime: new Date(appointment.donationStartTimeMillis),
        hospital: appointment.hospital,
      })
    );
  });
}

export function saveDonor(
  firstName: string,
  lastName: string,
  birthDate: string,
  phoneNumber: string,
  bloodType: BloodType
) {
  const currentUser = firebase.auth().currentUser;

  if (!currentUser?.uid || !currentUser.email) {
    console.error("User not authenticated");
    return;
  }

  const saveDonorFunction = firebase
    .functions()
    .httpsCallable(FunctionsApi.SaveDonorFunctionName);

  const request: FunctionsApi.SaveDonorRequest = {
    id: currentUser.uid,
    email: currentUser.email,
    firstName,
    lastName,
    phone: phoneNumber,
    bloodType,
    birthDate,
  };

  saveDonorFunction(request).catch((e) => console.error(e));
}

export async function getDonor(): Promise<Donor | undefined> {
  const currentUser = firebase.auth().currentUser;

  if (!currentUser?.uid || !currentUser.email) {
    console.error("User not authenticated");
    return undefined;
  }

  const getDonorFunction = firebase
    .functions()
    .httpsCallable(FunctionsApi.GetDonorFunctionName);

  const request: FunctionsApi.GetDonorRequest = {
    donorId: currentUser.uid,
  };

  try {
    const response = await getDonorFunction(
      request
    );
    const data = response.data as FunctionsApi.GetDonorResponse
    return data.donor;
  } catch (e) {
    console.error("Error getting donor", e);
    return undefined;
  }
}

export async function getFutureAppointments(): Promise<BookedAppointment[]> {
  const currentUser = firebase.auth().currentUser;

  if (!currentUser?.uid || !currentUser.email) {
    console.error("User not authenticated");
    return [];
  }

  const getDonorAppointmentsFunction = firebase
    .functions()
    .httpsCallable(FunctionsApi.GetDonorAppointmentsFunctionName);

  const request: FunctionsApi.GetDonorAppointmentsRequest = {
    donorId: currentUser.uid,
    fromMillis: new Date().getTime(),
  };

  try {
    const response = await getDonorAppointmentsFunction(request);
    return response.data.futureAppointments;
  } catch (e) {
    console.error(e);
    return [];
  }
}
