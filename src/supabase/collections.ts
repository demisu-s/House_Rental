// Write your collections here
export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  bio: string | null;
  created_at: string;
  imageUrl: string | null;
  mainPhoneNumber: string | null;
  secondaryPhoneNumber: string | null;
}

export type AuthUser = Pick<User, "email" | "id">;

export interface Property {
  area: number | null;
  city: string | null;
  country?: string | null;
  created_at?: string;
  haveParking?: boolean | null;
  id: number;
  isFurnished?: boolean | null;
  latitude?: number | null;
  longitude?: number | null;
  numberOfBathRooms: number | null;
  numberOfBedRooms: number | null;
  state: string | null;
  status?: string | null;
  street?: string | null;
  title: string | null;
  type: string | null;
  userId?: number | null;
  propertyImages?: string[];
  description?: string;
}

export interface Sell {
  created_at: string;
  description?: string | null;
  id: number;
  price: number | null;
  propertyId: number | null;
  title: string | null;
  userId: number | null;
  isFurnished?: boolean | null;
  status?: string | null;
  isDeleted: boolean | null;
}

export interface Rent {
  availableForRent: string | null;
  created_at: string;
  description: string | null;
  id: number;
  isDeleted: boolean | null;
  paymentFrequency: string | null;
  price: number | null;
  propertyId: number | null;
  title: string | null;
  userId: number | null;
  isFurnished?: boolean | null;
}

export interface PropertyImage {
  created_at: string;
  id: number;
  propertyId: number | null;
  url: string | null;
}
