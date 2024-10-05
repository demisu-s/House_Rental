import { usePropertyStore } from "@/store/property";
import { Property } from "@/supabase/collections";
import { useEffect } from "react";

interface PropertiesFilterResponse {
  isLoading: boolean;
  filteredProperties: Property[];
}

interface PropertiesFilterArgs {
  searchQuery: string;
  filterByType: string;
  filterByStatus: string;
}

export const usePropertiesFilter = ({
  searchQuery,
  filterByType,
  filterByStatus,
}: PropertiesFilterArgs): PropertiesFilterResponse => {
  const { isLoading, properties, getProperties } = usePropertyStore(
    (store) => store
  );

  const filteredProperties = properties.filter((property) => {
    // filter by type
    const isMatchingType =
      filterByType === "ALL" || filterByType === property.type;

    // filter by status
    const isMatchingStatus =
      filterByStatus === "ALL" || filterByStatus === property.status;

    // filter by search query
    let isMatchingSearch = true;
    if (searchQuery) {
      const searchQueryLower = searchQuery.toLowerCase();
      const titleLower = property.title ? property.title.toLowerCase() : "";
      const cityLower = property.city ? property.city.toLowerCase() : "";
      const streetLower = property.street ? property.street.toLowerCase() : "";

      isMatchingSearch =
        titleLower.includes(searchQueryLower) ||
        cityLower.includes(searchQueryLower) ||
        streetLower.includes(searchQueryLower);
    }

    return isMatchingType && isMatchingSearch && isMatchingStatus;
  });

  useEffect(() => {
    getProperties();
  }, []);

  return { isLoading, filteredProperties };
};
