import { Property, Rent } from "@/supabase/collections";

export enum PAYMENT_FREQUENCY {
  PER_MONTH = "PER_MONTH",
  PER_THREE_MONTHS = "PER_THREE_MONTHS",
  PER_SIX_MONTHS = "PER_SIX_MONTHS",
  PER_YEAR = "PER_YEAR",
}

export const paymentFrequencyValue = (value: string): PAYMENT_FREQUENCY => {
  switch (value) {
    case "PER_MONTH":
      return PAYMENT_FREQUENCY.PER_MONTH;
    case "PER_THREE_MONTH":
      return PAYMENT_FREQUENCY.PER_THREE_MONTHS;
    case "PER_SIX_MONTH":
      return PAYMENT_FREQUENCY.PER_SIX_MONTHS;
    default:
      return PAYMENT_FREQUENCY.PER_YEAR;
  }
};

export enum AVAILABILITY_FOR_RENT {
  IMMEDIATELY = "IMMEDIATELY",
  AFTER_A_MONTH = "AFTER_A_MONTH",
  AFTER_A_WEEK = "AFTER_A_WEEK",
  TO_BE_DISCUSSED = "TO_BE_DISCUSSED",
}

export const availabilityForRentValue = (
  value: string
): AVAILABILITY_FOR_RENT => {
  switch (value) {
    case "IMMEDIATELY":
      return AVAILABILITY_FOR_RENT.IMMEDIATELY;
    case "AFTER_A_MONTH":
      return AVAILABILITY_FOR_RENT.AFTER_A_MONTH;
    case "AFTER_A_WEEK":
      return AVAILABILITY_FOR_RENT.AFTER_A_WEEK;
    default:
      return AVAILABILITY_FOR_RENT.TO_BE_DISCUSSED;
  }
};

export interface NewRent {
  availableForRent: AVAILABILITY_FOR_RENT;
  description?: string | undefined;
  paymentFrequency: PAYMENT_FREQUENCY;
  price: number;
  propertyId: number;
  title: string;
  isFurnished: boolean;
}

export type RentData = Omit<Property, "created_at"> & Rent;

export interface UpdateRent {
  availableForRent: string | null;
  description?: string | null;
  id: number;
  isDeleted?: boolean | null;
  paymentFrequency: string | null;
  price: number | null;
  propertyId: number | null;
  title: string | null;
  isFurnished?: boolean | null;
}
