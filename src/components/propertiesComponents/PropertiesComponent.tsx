import { AllPropertiesCard } from "./AllPropertiesCard";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ADD_PROPERTY_ROUTE } from "@/router/routeConstants";
import { usePropertiesFilter } from "./usePropertiesFilter";
import { PROPERTY_STATUS, PROPERTY_TYPE } from "@/store/types/property";
import { Spinner } from "../common/Spinner";

export const PropertiesComponent = () => {
  const [filterByType, setFilterByType] = useState("ALL");
  const [filterByStatus, setFilterByStatus] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const { isLoading, filteredProperties } = usePropertiesFilter({ searchQuery, filterByType, filterByStatus })

  return (
    <div className="flex flex-col space-y-4 p-4 rounded-md bg-white h-auto overflow-y-auto">
      <div className="flex flex-col xs:flex-row justify-between items-center">
        <h1 className="text-2xl font-bold">Your Properties</h1>
        <button
          className="bg-main-color rounded-md p-4 text-white mt-4 md:mt-0"
          onClick={() => navigate(ADD_PROPERTY_ROUTE)}
        >
          Create Property
        </button>
      </div>
      <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0">
        <input
          type="text"
          placeholder="Search location or number of beds..."
          className="border p-2 rounded w-full md:w-2/5"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <select className="border p-2 rounded w-1/5"
          value={filterByType}
          onChange={(e) => setFilterByType(e.target.value)}
        >
          <option value={"ALL"}>Filter By Type</option>
          <option value={PROPERTY_TYPE.VILLA}>Villas</option>
          <option value={PROPERTY_TYPE.APARTMENT}>Apartments</option>
          <option value={PROPERTY_TYPE.CONDOMINIUM}>Condominium</option>
          <option value={PROPERTY_TYPE.HOUSE}>Houses</option>
        </select>
        <select className="border p-2 rounded w-full md:w-1/5"
          value={filterByStatus}
          onChange={(e) => setFilterByStatus(e.target.value)}
        >
          <option value={"ALL"}>Filter By Status</option>
          <option value={PROPERTY_STATUS.ACTIVE}>Active</option>
          <option value={PROPERTY_STATUS.IN_MAINTENANCE}>Maintenance</option>
          <option value={PROPERTY_STATUS.READY_FOR_RENT}>Ready For Rent</option>
          <option value={PROPERTY_STATUS.READY_FOR_SELL}>Ready For Sell</option>
        </select>
      </div>

      <div className="flex flex-wrap p-4">
        <div className="w-full">
          {
            isLoading ? <Spinner /> : <AllPropertiesCard homes={filteredProperties} />
          }
        </div>
      </div>
    </div>
  );
};
