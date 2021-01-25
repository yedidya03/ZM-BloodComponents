import { CallableContext } from "firebase-functions/lib/providers/https";
import { validateAppointmentEditPermissions } from "./UserValidator";
import {
  deleteAppointmentsByIds,
  getAppointmentsByIds,
} from "../dal/AppointmentDataAccessLayer";

interface DeleteAppointmentRequest {
  appointmentIds: string[];
}

export default async function (
  request: DeleteAppointmentRequest,
  context: CallableContext
) {
  const appointmentIds = request.appointmentIds;

  const appointments = await getAppointmentsByIds(appointmentIds);

  const hospitals = appointments.map((doc) => doc.hospital);

  // validate user is allowed delete appointments of this hospital
  await validateAppointmentEditPermissions(context.auth?.uid, hospitals);

  await deleteAppointmentsByIds(appointmentIds);

  return appointmentIds.length;
}