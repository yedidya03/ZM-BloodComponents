import React from "react";
import Button from "../components/Button";
import Text from "../components/Text";

interface HomeScreenProps {
  firstName: string;
  onSignOut: () => void;
  goToBookDonationScreen: () => void;
  goToUpcomingDonationScreen: () => void;
  goToMyProfileScreen: () => void;
}

export default function HomeScreen(props: HomeScreenProps) {
  return (
    <div>
      <Text>שלום {props.firstName}</Text>
      בחר מסך:
      <Button
        title="מסך תרומה קרובה"
        onClick={props.goToUpcomingDonationScreen}
      />
      <Button title="מסך קביעת תרומה" onClick={props.goToBookDonationScreen} />
      <Button title="הפרופיל שלי" onClick={props.goToMyProfileScreen} />
      <Button title="התנתק" onClick={props.onSignOut} />
    </div>
  );
}
