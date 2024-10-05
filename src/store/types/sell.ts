import { Property, Sell } from "@/supabase/collections";

export enum SELL_STATUS {
  SOLD = "SOLD",
  INACTIVE = "INACTIVE",
  ACTIVE = "ACTIVE",
}
export const sellValueDeterminer = (value: string): SELL_STATUS => {
  switch (value) {
    case "SOLD":
      return SELL_STATUS.ACTIVE;
    case "INACTIVE":
      return SELL_STATUS.INACTIVE;
    default:
      return SELL_STATUS.ACTIVE;
  }
};

export interface NewSell {
  description?: string | undefined;
  price: number;
  propertyId: number;
  title: string;
  isFurnished: boolean;
  status: SELL_STATUS;
}

export type SellData = Omit<Property, "created_at"> & Sell;

export interface UpdateSell {
  description?: string | null;
  id: number;
  price: number | null;
  propertyId: number | null;
  title: string | null;
  isFurnished: boolean | null;
  status: string | null;
}
