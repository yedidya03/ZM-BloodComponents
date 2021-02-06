import React, { useEffect, useState } from "react";
import { BloodType, Donor } from "@zm-blood-components/common";
import { useHistory } from "react-router-dom";
import * as FirebaseFunctions from "../firebase/FirebaseFunctions";
import MyProfileScreen from "./MyProfileScreen";

export default function MyProfileScreenContainer() {
  const [donor, setDonor] = useState<Donor>();
  const history = useHistory();

  useEffect(() => {
    FirebaseFunctions.getDonor().then(setDonor);
  }, [setDonor]);

  const onSave = (
    firstName: string,
    lastName: string,
    birthDate: string,
    phoneNumber: string,
    bloodType: BloodType
  ) => {
    FirebaseFunctions.saveDonor(
      firstName,
      lastName,
      birthDate,
      phoneNumber,
      bloodType
    );
    history.goBack();
  };

  return <MyProfileScreen onSave={onSave} donor={donor} />;
}