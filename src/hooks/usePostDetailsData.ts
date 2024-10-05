import { RentData } from "@/store/types/rent";
import { SellData } from "@/store/types/sell";
import { usePropertyStore } from "@/store/property";
import { useRentStore } from "@/store/rent";
import { useSellStore } from "@/store/sell";
import { getPropertyData } from "./helper";
import { Rent, Sell } from "@/supabase/collections";

interface PostDetailsResponse {
  data: SellData | RentData;
}

interface PostDetailsArgs {
  page: string;
  id: number;
}

export const usePostDetailsData = ({
  page,
  id,
}: PostDetailsArgs): PostDetailsResponse => {
  const sell: Sell = useSellStore(
    (store) => store.sells.find((sell) => sell.id === id) as Sell
  );
  const rent: Rent = useRentStore(
    (store) => store.rents.find((rent) => rent.id === id) as Rent
  );

  const properties = usePropertyStore((store) => store.properties);

  const propertyId = page === "RENT" ? rent.propertyId : sell.propertyId;

  const property = getPropertyData(Number(propertyId), properties);

  const sellData: SellData = {
    id: sell.id,
    description: String(sell.description),
    area: property.area,
    city: property.city,
    propertyImages: property.propertyImages,
    numberOfBathRooms: property.numberOfBathRooms,
    numberOfBedRooms: property.numberOfBedRooms,
    price: sell.price,
    title: sell.title,
    created_at: sell.created_at,
    state: property.state,
    country: property.country,
    latitude: property.latitude,
    longitude: property.longitude,
    type: property.type,
    isFurnished: sell.isFurnished,
    street: property.street,
    propertyId: sell.propertyId,
    userId: sell.userId,
    haveParking: property.haveParking,
    status: sell.status,
    isDeleted: sell.isDeleted,
  };

  const rentData: RentData = {
    id: rent.id,
    description: String(rent.description),
    area: property.area,
    city: property.city,
    propertyImages: property.propertyImages,
    numberOfBathRooms: property.numberOfBathRooms,
    numberOfBedRooms: property.numberOfBedRooms,
    price: rent.price,
    title: rent.title,
    created_at: rent.created_at,
    state: property.state,
    country: property.country,
    latitude: property.latitude,
    longitude: property.longitude,
    type: property.type,
    isFurnished: rent.isFurnished,
    street: property.street,
    propertyId: rent.propertyId,
    userId: rent.userId,
    haveParking: property.haveParking,
    availableForRent: rent.availableForRent,
    isDeleted: rent.isDeleted,
    status: property.status,
    paymentFrequency: rent.paymentFrequency,
  };

  return { data: page === "RENT" ? rentData : sellData };
};
