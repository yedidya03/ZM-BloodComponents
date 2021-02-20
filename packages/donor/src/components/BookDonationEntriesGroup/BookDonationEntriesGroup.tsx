import React from "react";
import styles from "./BookDonationEntriesGroup.module.scss";
import BookDonationEntry from "../BookDonationEntry";
import Text from "../basic/Text";
import { DonationSlot } from "../../utils/AppointmentsGrouper";

export interface BookDonationDayEntriesProps {
  title: string;
  donationSlots: DonationSlot[];
  onSlotSelected: (donationSlot: DonationSlot) => void;
}

function BookDonationEntriesGroup({
  donationSlots = [],
  onSlotSelected,
  title,
}: BookDonationDayEntriesProps) {
  return (
    <section className={styles.component}>
      <Text>{title}</Text>
      <div className={styles.entriesContainer}>
        {donationSlots.map((slot) => (
          <BookDonationEntry
            key={slot.donationStartTime + slot.hospital}
            hospital={slot.hospital}
            donationStartTime={slot.donationStartTime}
            onRegisterClick={() => onSlotSelected(slot)}
          />
        ))}
      </div>
    </section>
  );
}

export default BookDonationEntriesGroup;
