import { RentData } from "@/store/types/rent";
import { SellData } from "@/store/types/sell";
import { Property } from "@/supabase/collections";

export const getPropertyData = (propertyId: number, properties: Property[]) => {
  return properties.find((p) => p.id === propertyId) as Property;
};

export const filterDataByTypeAndSearch = (
  data: SellData[] | RentData[],
  filterByType: string,
  searchQuery: string
) => {
  return data.filter((item) => {
    const isMatchingType = filterByType === "" || filterByType === item.type;
    let isMatchingSearch = true;
    if (searchQuery) {
      const searchQueryLower = searchQuery.toLowerCase();
      const titleLower = item.title ? item.title.toLowerCase() : "";
      const cityLower = item.city ? item.city.toLowerCase() : "";
      const streetLower = item.street ? item.street.toLowerCase() : "";

      isMatchingSearch =
        titleLower.includes(searchQueryLower) ||
        cityLower.includes(searchQueryLower) ||
        streetLower.includes(searchQueryLower);
    }

    return isMatchingType && isMatchingSearch;
  });
};
