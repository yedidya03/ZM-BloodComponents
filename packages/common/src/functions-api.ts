import { AvailableAppointment, BloodType, DbAdmin, Hospital } from "./types";

// Donor functions:

export interface GetAvailableAppointmentsRequest {}

export interface GetAvailableAppointmentsResponse {
  availableAppointments: AvailableAppointment[];
}

export interface BookAppointmentRequest {
  // Ids of appointments in the time slot, book first one available
  appointmentIds: string[];
}

export interface CancelAppointmentRequest {
  // Ids of appointments in the time slot, book first one available
  appointmentId: string;
}

export interface GetDonorRequest {
  donorId: string;
}

export interface SaveDonorRequest {
  id: string;
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