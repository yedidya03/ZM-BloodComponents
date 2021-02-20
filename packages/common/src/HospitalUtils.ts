import { Hospital, SelectOption } from "./types";
import { LocaleUtils } from "./index";

export function getAllHospitalOptions(defaultLabel?: string) {
  return getHospitalOptions(Object.values(Hospital), defaultLabel);
}

// If defaultLabel, will add an option with value ""
export function getHospitalOptions(
  hospitals: Hospital[],
  defaultLabel?: string
) {
  let options: SelectOption<Hospital | "">[] = hospitals.map(hospitalToOption);
  if (defaultLabel) {
    options.unshift({ label: defaultLabel, key: defaultLabel, value: "" });
  }
  return options;
}

function hospitalToOption(hospital: Hospital): SelectOption<Hospital> {
  return {
    label: LocaleUtils.getHospitalName(hospital),
    value: hospital,
    key: hospital,
  };
}