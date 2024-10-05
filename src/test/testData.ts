import { RentData } from "@/store/types/rent";
import { SellData } from "@/store/types/sell";
import { Property, PropertyImage, Rent, Sell } from "@/supabase/collections";

export const testProperty: Property = {
  area: 1200,
  city: "San Francisco",
  country: "USA",
  created_at: "2024-08-11T10:00:00Z",
  haveParking: true,
  id: 1,
  isFurnished: false,
  latitude: 37.7749,
  longitude: -122.4194,
  numberOfBathRooms: 2,
  numberOfBedRooms: 3,
  state: "California",
  status: "Available",
  street: "123 Market St",
  title: "Modern Apartment in Downtown",
  type: "Apartment",
  userId: 1001,
  propertyImages: [
    "https://example.com/image1.jpg",
    "https://example.com/image2.jpg",
  ],
  description:
    "A beautiful, modern apartment located in the heart of the city.",
};

export const testSell: Sell = {
  created_at: "2024-08-11T10:00:00Z",
  description: "This property is a perfect investment opportunity.",
  id: 1,
  price: 500000,
  propertyId: 1,
  title: "Investment Property in San Francisco",
  userId: 1001,
  isFurnished: false,
  status: "For Sale",
  isDeleted: false,
};

export const testRent: Rent = {
  availableForRent: "2024-09-01",
  created_at: "2024-08-11T10:00:00Z",
  description: "Spacious apartment available for rent in a prime location.",
  id: 1,
  isDeleted: false,
  paymentFrequency: "Monthly",
  price: 2000,
  propertyId: 1,
  title: "Downtown Apartment for Rent",
  userId: 1001,
  isFurnished: true,
};

export const testPropertyImage: PropertyImage = {
  created_at: "2024-08-11T10:00:00Z",
  id: 1,
  propertyId: 1,
  url: "https://example.com/image1.jpg",
};

export const testRentData: RentData = {
  area: 1200,
  city: "Alaska",
  country: "USA",
  haveParking: true,
  id: 1,
  isFurnished: true,
  latitude: 37.7749,
  longitude: -122.4194,
  numberOfBathRooms: 2,
  numberOfBedRooms: 3,
  state: "California",
  status: "Available",
  street: "123 Market St",
  title: "Downtown Apartment for Rent",
  type: "Apartment",
  userId: 1001,
  propertyImages: [
    "https://example.com/image1.jpg",
    "https://example.com/image2.jpg",
  ],
  description: "Spacious apartment available for rent in a prime location.",

  // Rent properties
  availableForRent: "2024-09-01",
  created_at: "2024-08-11T10:00:00Z",
  isDeleted: false,
  paymentFrequency: "Monthly",
  price: 2000,
  propertyId: 1,
};

export const testSellData: SellData = {
  area: 1200,
  city: "San Francisco",
  country: "USA",
  haveParking: true,
  id: 1,
  isFurnished: false,
  latitude: 37.7749,
  longitude: -122.4194,
  numberOfBathRooms: 2,
  numberOfBedRooms: 3,
  state: "California",
  status: "For Sale",
  street: "123 Market St",
  title: "Investment Property in San Francisco",
  type: "Apartment",
  userId: 1001,
  propertyImages: [
    "https://example.com/image1.jpg",
    "https://example.com/image2.jpg",
  ],
  description:
    "A beautiful, modern apartment located in the heart of the city.",

  // Sell properties
  created_at: "2024-08-11T10:00:00Z",
  price: 500000,
  propertyId: 1,
  isDeleted: false,
};
