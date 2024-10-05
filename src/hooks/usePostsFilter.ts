import { useEffect } from "react";
import { useSellStore } from "@/store/sell";
import { SellData } from "@/store/types/sell";
import { usePropertyStore } from "@/store/property";
import { useRentStore } from "@/store/rent";
import { RentData } from "@/store/types/rent";
import { filterDataByTypeAndSearch, getPropertyData } from "./helper";

interface PostsFilterResponse {
  isLoading: boolean;
  isRentLoading: boolean;
  sellsData: SellData[];
  rentsData: RentData[];
}

interface PostsFilterArgs {
  searchQuery: string;
  filterByType: string;
  page: "Dashboard" | "Posts";
}

export const usePostsFilter = ({
  searchQuery,
  filterByType,
  page,
}: PostsFilterArgs): PostsFilterResponse => {
  const { isLoading, sells, getSells } = useSellStore((store) => store);
  const {
    isLoading: isRentLoading,
    rents,
    getRents,
  } = useRentStore((store) => store);

  const { properties, isPropertiesLoaded } = usePropertyStore((store) => store);

  useEffect(() => {
    if (isPropertiesLoaded) {
      if (page === "Dashboard") {
        getSells(true);
        getRents(true);
      } else {
        getSells(false);
        getRents(false);
      }
    }
  }, [isPropertiesLoaded, page, getSells, getRents]);

  if (!isPropertiesLoaded) {
    return {
      isLoading: true,
      isRentLoading: true,
      sellsData: [],
      rentsData: [],
    };
  }

  const sellsData = sells.map((sell) => {
    const property = getPropertyData(Number(sell.propertyId), properties);
    return {
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
  });

  const filteredSellsData = filterDataByTypeAndSearch(
    sellsData,
    filterByType,
    searchQuery
  );

  const rentsData = rents.map((rent) => {
    const property = getPropertyData(Number(rent.propertyId), properties);
    return {
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
  });

  const filteredRentsData = filterDataByTypeAndSearch(
    rentsData,
    filterByType,
    searchQuery
  );

  return {
    isLoading,
    isRentLoading,
    sellsData: filteredSellsData as SellData[],
    rentsData: filteredRentsData as RentData[],
  };
};
