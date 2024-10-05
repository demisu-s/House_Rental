import { RentData } from "@/store/types/rent";
import { SellData } from "@/store/types/sell";
import { usePostsFilter } from "./usePostsFilter";

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
  numberOfBeds: number;
  initialPrice: number;
  finalPrice: number;
}

export const useDashboardFilter = ({
  searchQuery,
  filterByType,
  page,
  numberOfBeds,
  initialPrice,
  finalPrice,
}: PostsFilterArgs): PostsFilterResponse => {
  const { isLoading, sellsData, isRentLoading, rentsData } = usePostsFilter({
    filterByType,
    searchQuery,
    page: page,
  });

  // Filter undeleted data
  const availableSellsData = sellsData.filter(
    (sell) => sell.isDeleted === false
  );
  const availableRentsData = rentsData.filter(
    (rent) => rent.isDeleted === false
  );

  // Filter sellsData and rentsData based on numberOfBeds
  const filteredSellsData = availableSellsData.filter(
    (sell) => Number(sell.numberOfBedRooms) >= numberOfBeds
  );
  const filteredRentsData = availableRentsData.filter(
    (rent) => Number(rent.numberOfBathRooms) >= numberOfBeds
  );

  // Filter sellsData and rentsData based on price range
  const priceFilteredSellsData = filteredSellsData.filter(
    (sell) =>
      Number(sell.price) >= initialPrice && Number(sell.price) <= finalPrice
  );
  const priceFilteredRentsData = filteredRentsData.filter(
    (rent) =>
      Number(rent.price) >= initialPrice && Number(rent.price) <= finalPrice
  );

  return {
    isLoading,
    isRentLoading,
    sellsData: priceFilteredSellsData,
    rentsData: priceFilteredRentsData,
  };
};
