import {
  BloodType,
  BookedAppointment,
  DbAdmin,
  Donor,
  Hospital,
} from "./types";

// Donor functions:

export const GetAvailableAppointmentsFunctionName = "getAvailableAppointments";
export interface GetAvailableAppointmentsRequest {}

type AvailableAppointmentEntry = {
  id: string;
  donationStartTimeMillis: number; // API returns millis
  hospital: Hospital;
};

export interface GetAvailableAppointmentsResponse {
  availableAppointments: AvailableAppointmentEntry[];
}

export const GetDonorAppointmentsFunctionName = "getDonorAppointments";
export interface GetDonorAppointmentsRequest {
  donorId: string;
  fromMillis?: number;
  toMillis?: number;
}

export interface GetDonorAppointmentsResponse {
  completedAppointments: BookedAppointment[];
  futureAppointments: BookedAppointment[];
}

export interface BookAppointmentRequest {
  // Ids of appointments in the time slot, book first one available
  appointmentIds: string[];
}

export interface CancelAppointmentRequest {
  // Ids of appointments in the time slot, book first one available
  appointmentId: string;
}

export const GetDonorFunctionName = "getDonor";
export interface GetDonorRequest {
  donorId: string;
}

export interface GetDonorResponse {
  donor?: Donor;
}

export const SaveDonorFunctionName = "saveDonor";
export interface SaveDonorRequest {
  id: string;
  firstName: string;
  lastName: string;
  birthDate: string; // YYYY-MM-DD
  phone: string;
  email: string;
  bloodType: BloodType;
}

// Admin functions:
export interface AddAppointmentRequest {
  hospital: Hospital;
  donationStartTime: string;
  slots: number;
}

export interface DeleteAppointmentRequest {
  appointmentIds: string[];
}

export interface SaveAdminRequest {
  admin: DbAdmin;
}
