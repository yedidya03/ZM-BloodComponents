import { BloodType, Donor } from "@zm-blood-components/common";
import * as FirebaseFunctions from "../../firebase/FirebaseFunctions";
import MyProfileScreen from "./MyProfileScreen";
import "firebase/auth";
import { useHistory } from "react-router-dom";

interface MyProfileScreenContainerProps {
  user: Donor;
  updateUserInAppState: (user: Donor) => void;
}

export default function MyProfileScreenContainer(
  props: MyProfileScreenContainerProps
) {
  const history = useHistory();

  const onSave = (
    firstName: string,
    lastName: string,
    phoneNumber: string,
    bloodType: BloodType
  ) => {
    const updatedUser = FirebaseFunctions.saveDonor(
      firstName,
      lastName,
      "",
      phoneNumber,
      bloodType
    );
    props.updateUserInAppState(updatedUser);
    history.goBack();
  };

  return <MyProfileScreen onSave={onSave} user={props.user} />;
}
