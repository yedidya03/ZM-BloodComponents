import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { MainNavigationKeys } from "./MainNavigationKeys";
import ExtendedSignupScreenContainer from "../../screens/extendedSignup/ExtendedSignupScreenContainer";
import UpcomingDonationScreenContainer from "../../screens/UpcommingDonation/UpcomingDonationScreenContainer";
import MyProfileScreenContainer from "../../screens/MyProfileScreenContainer";
import BookDonationScreenContainer from "../../screens/bookDonation/BookDonationScreenContainer";
import { BookedAppointment, Donor } from "@zm-blood-components/common";
import QuestionnaireScreenContainer from "../../screens/questionnaire/QuestionnaireScreenContainer";
import AppHeader from "./AppHeader/AppHeader";
import Styles from "./LoggedInRouter.module.scss";

interface LoggedInRouterProps {
  user?: Donor;
  bookedAppointment?: BookedAppointment;
  setUser: (user: Donor) => void;
  setBookedAppointment: (bookedAppointment?: BookedAppointment) => void;
}

export default function LoggedInRouter(props: LoggedInRouterProps) {
  const { user, bookedAppointment, setUser, setBookedAppointment } = props;

  const { firstName, lastName, phone, bloodType } = user as Donor;

  if (!user || !firstName || !lastName || !phone || !bloodType) {
    return <ExtendedSignupScreenContainer updateUserInAppState={setUser} />;
  }

  // If user has booked appointment, show it
  if (bookedAppointment) {
    return (
      <UpcomingDonationScreenContainer
        user={user}
        bookedAppointment={bookedAppointment}
        setBookedAppointment={setBookedAppointment}
      />
    );
  }

  // If user has no booked appointment, go to book donation flow
  return (
    <>
      <Router>
        <AppHeader />
        <div className={Styles["after-header"]}>
          <Switch>
            <Route path={"/" + MainNavigationKeys.MyProfile}>
              <MyProfileScreenContainer user={user} />
            </Route>
            <Route path={"/" + MainNavigationKeys.Questionnaire}>
              <QuestionnaireScreenContainer
                setBookedAppointment={props.setBookedAppointment}
              />
            </Route>
            <Route path={"*"}>
              <BookDonationScreenContainer user={user} />
            </Route>
          </Switch>
        </div>
      </Router>
    </>
  );
}
