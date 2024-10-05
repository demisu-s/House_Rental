import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PostCard } from "./PostCard";
import { useState } from "react";
import { usePostsFilter } from "../../hooks/usePostsFilter";
import { CHOICE, PROPERTY_TYPE } from "@/store/types/property";
import { SellData } from "@/store/types/sell";
import { DropdownMenuChoice } from "./DropDownMenuChoice";
import { RentData } from "@/store/types/rent";
import { Spinner } from "../common/Spinner";

export const PostComponent = () => {

  const [searchQuery, setSearchQuery] = useState("");
  const [filterByType, setFilterByType] = useState("");
  const [filterByCategory, setFilterByCategory] = useState("ALL");

  const { isLoading, sellsData, isRentLoading, rentsData } = usePostsFilter({ filterByType, searchQuery, page: "Posts" });

  const viewedData: (RentData | SellData)[] = filterByCategory === CHOICE.RENT ? rentsData : filterByCategory === CHOICE.SELL ? sellsData : [...sellsData, ...rentsData]

  return (
    <div className="flex flex-col p-4 rounded-md space-y-2 h-auto bg-white overflow-y-auto">
      <div className="flex flex-col xs:flex-row justify-between items-center">
        <h1 className="text-2xl font-bold">Your Posts</h1>
        <div className="flex items-center mt-2 md:mt-0">
          <DropdownMenuChoice />
        </div>
      </div>
      <div className="flex flex-wrap space-y-2 space-x-2 md:flex md:space-x-4">
        <input
          type="text"
          placeholder="Search by location, name"
          className="border p-2 rounded w-full md:w-2/5 mt-2"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <select
          className="border p-2 rounded w-1/3"
          value={filterByCategory}
          onChange={(e) => setFilterByCategory(e.target.value)}
        >
          <option value={CHOICE.ALL}>All</option>
          <option value={CHOICE.RENT}>Rent</option>
          <option value={CHOICE.SELL}>Sell</option>
        </select>
        <select className="border p-2 rounded w-1/5"
          value={filterByType}
          onChange={(e) => setFilterByType(e.target.value)}
        >
          <option>Filter By Type</option>
          <option value={PROPERTY_TYPE.VILLA}>Villas</option>
          <option value={PROPERTY_TYPE.APARTMENT}>Apartments</option>
          <option value={PROPERTY_TYPE.CONDOMINIUM}>Condominium</option>
          <option value={PROPERTY_TYPE.HOUSE}>Houses</option>
        </select>
      </div>

      <div className="flex flex-wrap md:flex h-full pt-8">
        <div className="w-full md:w-full h-full">
          <Tabs defaultValue="All">
            <TabsList className="px-10 py-8">
              <div className="flex space-x-4">
                <TabsTrigger value="All" className="text-md sm:text-lg font-semibold px-4 py-2">
                  All
                </TabsTrigger>
                <TabsTrigger value="Active" className="text-md sm:text-lg font-semibold px-4 py-2">
                  Active
                </TabsTrigger>
                <TabsTrigger value="Archive" className="text-md sm:text-lg font-semibold px-4 py-2">
                  Archive
                </TabsTrigger>
              </div>
            </TabsList>

            {
              isLoading || isRentLoading ? <Spinner /> : (
                <>
                  <TabsContent value="All">
                    <PostCard homes={viewedData} filterStatus="ALL" />
                  </TabsContent>
                  <TabsContent value="Active">
                    <PostCard homes={viewedData} filterStatus="Active" />
                  </TabsContent>
                  <TabsContent value="Archive">
                    <PostCard homes={viewedData} filterStatus="Archive" />
                  </TabsContent>
                </>
              )
            }
          </Tabs>
        </div>
      </div>
    </div>
  );
};
