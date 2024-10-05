export enum PROPERTY_TYPE {
  APARTMENT = "APARTMENT",
  HOUSE = "HOUSE",
  VILLA = "VILLA",
  CONDOMINIUM = "CONDOMINIUM",
}

export const propertyTypeValue = (value: string): PROPERTY_TYPE => {
  switch (value) {
    case "APARTMENT":
      return PROPERTY_TYPE.APARTMENT;
    case "HOUSE":
      return PROPERTY_TYPE.HOUSE;
    case "VILLA":
      return PROPERTY_TYPE.VILLA;
    default:
      return PROPERTY_TYPE.CONDOMINIUM;
  }
};

export enum PROPERTY_STATUS {
  ACTIVE = "ACTIVE",
  IN_MAINTENANCE = "IN_MAINTENANCE",
  READY_FOR_RENT = "READY_FOR_RENT",
  READY_FOR_SELL = "READY_FOR_SELL",
  SALE = "SALE",
  RENT = "RENT",
  RENTED = "RENTED",
  SOLD = "SOLD",
}

export const propertyStatusValue = (value: string): PROPERTY_STATUS => {
  switch (value) {
    case "ACTIVE":
      return PROPERTY_STATUS.ACTIVE;
    case "IN_MAINTENANCE":
      return PROPERTY_STATUS.IN_MAINTENANCE;
    case "READY_FOR_RENT":
      return PROPERTY_STATUS.READY_FOR_RENT;
    default:
      return PROPERTY_STATUS.READY_FOR_SELL;
  }
};

export enum CHOICE {
  ALL = "ALL",
  RENT = "RENT",
  SELL = "SELL",
}

export interface NewProperty {
  title: string;
  area: number;
  country: string;
  state: string;
  city: string;
  street: string;
  latitude: number;
  longitude: number;
  haveParking: boolean;
  isFurnished: boolean;
  numberOfBathRooms: number;
  numberOfBedRooms: number;
  status: PROPERTY_STATUS;
  type: PROPERTY_TYPE;
  description?: string;
  userId?: number;
  images: File[];
  location?: { lat: number; lng: number };
}

export interface UpdateProperty {
  id: number;
  title?: string;
  area?: number;
  country?: string;
  state?: string;
  city?: string;
  street?: string;
  latitude?: string;
  longitude?: string;
  haveParking?: boolean;
  isFurnished?: boolean;
  numberOfBathRooms?: number;
  numberOfBedRooms?: number;
  status?: PROPERTY_STATUS;
  type?: PROPERTY_TYPE;
  description?: string;
  images: File[];
  location?: { lat: number; lng: number };
}
