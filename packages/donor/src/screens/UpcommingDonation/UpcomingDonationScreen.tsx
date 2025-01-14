import React from "react";
import {
  BookedAppointment,
  DateUtils,
  Hospital,
  LocaleUtils,
} from "@zm-blood-components/common";
import styles from "./UpcomingDonationScreen.module.scss";
import ZMScreen from "../../components/basic/ZMScreen";
import Popup from "../../components/basic/Popup";
import { Color } from "../../constants/colors";
import Illustration from "../../assets/images/exists appointment.svg";
import Cancellation from "../../assets/images/cancelation.svg";
import Whatsapp from "../../assets/images/whatsup-color-big.svg";
import TrashIcon from "../../assets/icons/trash.svg";
import { WHATSAPP_LINK } from "../contact/ContactScreen";
import UpcomingDonationInfo from "./UpcomingDonationInfo";

export interface UpcomingDonationScreenProps {
  bookedAppointment: BookedAppointment;
  fullName: string;
  onCancel: () => Promise<void>;
}

export default function UpcomingDonationScreen({
  fullName,
  onCancel,
  bookedAppointment,
}: UpcomingDonationScreenProps) {
  const donationDate = new Date(bookedAppointment.donationStartTimeMillis);
  return (
    <ZMScreen hasBurgerMenu>
      <div className={styles.pinkContainer}>
        <div className={styles.welcome}>
          <img
            src={Illustration}
            alt={"illustration"}
            className={styles.illustration}
          />
          <div className={styles.welcomeTitle}>
            <div>היי</div>
            <div>{fullName},</div>
            <div className={styles.welcomeText}>בקרוב נפגש</div>
          </div>
        </div>

        <div className={styles.appointmentDetails}>
          <div className={styles.card}>
            <div className={styles.detailsTitleContainer}>
              <div className={styles.detailsTitle}>פרטי התור שלך</div>
              <CancelButton onCancel={onCancel} />
            </div>

            <div className={styles.detailsText}>
              <div className={styles.detailLabel}>איפה?</div>
              <div className={styles.detailValue}>
                בית החולים
                {" " + LocaleUtils.getHospitalName(bookedAppointment.hospital)}
              </div>
              <NeedRideButton hospital={bookedAppointment.hospital} />

              <div className={styles.detailLabel}>מתי?</div>
              <div className={styles.detailValue}>
                {donationDate.toLocaleDateString(
                  "he-He",
                  DateUtils.ShortDateFormat
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <UpcomingDonationInfo hospital={bookedAppointment.hospital} />
    </ZMScreen>
  );
}

function NeedRideButton(props: { hospital: Hospital }) {
  const [open, setOpen] = React.useState(false);

  let content = "";
  switch (props.hospital) {
    case Hospital.BEILINSON:
      content =
        "כדי לתאם הסעה ניתן להתקשר למיכל, מתאמת התרומות בבילינסון, בטלפון 03−9376052, או לשלוח הודעה בוואטסאפ לרכז שלך עם מיקום וזמני האיסוף";
      break;

    default:
      content =
        "ניתן לתאם הסעה על ידי שליחת הודעת וואטסאפ לרכז שלך עם עם מיקום וזמני האיסוף";
  }

  return (
    <>
      <div className={styles.link} onClick={() => setOpen(true)}>
        אני צריכ/ה הסעה
      </div>
      <Popup
        open={open}
        title="אין לך איך להגיע?"
        content={content}
        buttonApproveText="בקשת הסעה"
        goBackText="בעצם לא צריך"
        onBack={() => setOpen(false)}
        onApproved={() => {
          window.open(WHATSAPP_LINK);
        }}
        image={Whatsapp}
        buttonColor={Color.Primary}
      />
    </>
  );
}

function CancelButton(props: { onCancel: () => Promise<void> }) {
  const [open, setOpen] = React.useState(false);

  const onCancelAppointment = async () => {
    await props.onCancel();
  };

  return (
    <>
      <div className={styles.cancelButton} onClick={() => setOpen(true)}>
        ביטול תור
        <img src={TrashIcon} alt={"Cancel"} className={styles.cancelIcon} />
      </div>
      <Popup
        open={open}
        title="רק מוודאים"
        content="בטוח/ה שברצונך לבטל את התור?"
        buttonApproveText="כן, בטלו לי את התור"
        goBackText="אל תבטלו לי את התור"
        onBack={() => setOpen(false)}
        onApproved={onCancelAppointment}
        image={Cancellation}
        buttonColor={Color.Secondary}
      />
    </>
  );
}
