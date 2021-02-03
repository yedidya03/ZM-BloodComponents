import * as admin from "firebase-admin";
import { DbDonor, Collections } from "@zm-blood-components/common";

export async function getDonorOrThrow(donorId: string) {
  const donor = await getDonor(donorId);
  if (!donor) {
    throw Error("Donor not found");
  }
  return donor;
}

export async function getDonor(donorId: string) {
  const collection = admin.firestore().collection(Collections.DONORS);
  const donor = await collection.doc(donorId).get();

  if (!donor.exists) {
    return undefined;
  }

  return donor.data() as DbDonor;
}

export async function setDonor(donor: DbDonor) {
  const collection = admin.firestore().collection(Collections.DONORS);
  await collection.doc(donor.id).set(donor);
}

export async function deleteDonor(donorId: string) {
  const collection = admin.firestore().collection(Collections.DONORS);
  await collection.doc(donorId).delete();
}
