import { useState } from 'react';
import { CardList } from './CardList';
import { RightSideBar } from './RightSideBar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PROPERTY_TYPE } from '@/store/types/property';
import { useDashboardFilter } from '@/hooks/useDashboardFilter';
import { RentData } from '@/store/types/rent';
import { SellData } from '@/store/types/sell';
import EmptyComponent from '../common/EmptyComponent';
import { Spinner } from '../common/Spinner';


export const CardComponent = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterByType, setFilterByType] = useState("");
  const [numberOfBeds, setNumberOfBeds] = useState(1);
  const [initialPrice, setInitialPrice] = useState<number>(0);
  const [finalPrice, setFinalPrice] = useState<number>(Number.MAX_VALUE);
  const [filterByCategory, setFilterByCategory] = useState("Buy");

  const { isLoading, sellsData, isRentLoading, rentsData } = useDashboardFilter({ filterByType, searchQuery, numberOfBeds, initialPrice, finalPrice, page: "Posts" });

  const viewedData: (RentData | SellData)[] = filterByCategory === "Buy" ? sellsData : rentsData;

  return (
    <div className="flex flex-col p-4 rounded-md space-y-2 h-auto bg-white">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">{`${viewedData.length}`} Results</h1>
        <div className="flex items-center mt-2 md:mt-0">
          <span className="mr-2">Map view</span>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" className="sr-only" />
            <div className="w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
          </label>
        </div>
      </div>
      <div className="flex flex-wrap space-y-2 space-x-2 md:flex md:space-x-4">
        <input
          type="text"
          placeholder="Search here..."
          className="border p-2 rounded w-full md:w-1/6 mt-2"
          name="searchQuery"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <select className="border p-2 rounded sm:w-1/6 bg-main-color text-white"
          value={numberOfBeds}
          onChange={(e) => setNumberOfBeds(Number(e.target.value))}
        >
          <option value={2}>2 bed rooms</option>
          <option value={3}>3 bed rooms</option>
          <option value={4}>4 bed rooms</option>
          <option value={5}>5 bed rooms</option>
        </select>
        <select className="border p-2 rounded w-1/6"
          value={filterByType}
          onChange={(e) => setFilterByType(e.target.value)}
        >
          <option value={""}>Filter By Type</option>
          <option value={PROPERTY_TYPE.VILLA}>Villas</option>
          <option value={PROPERTY_TYPE.APARTMENT}>Apartments</option>
          <option value={PROPERTY_TYPE.CONDOMINIUM}>Condominium</option>
          <option value={PROPERTY_TYPE.HOUSE}>Houses</option>
        </select>

        <input
          type="number"
          placeholder="Initial Price"
          className="border p-2 rounded w-3/4 md:w-1/6"
          name="initialPrice"
          value={initialPrice === 0 ? '' : initialPrice}
          onChange={(e) => Number(setInitialPrice(Number(e.target.value)))}
        />
        <input
          type="number"
          placeholder="Final Price"
          className="border p-2 rounded w-3/4 md:w-1/6"
          name="finalPrice"
          value={finalPrice === Number.MAX_VALUE ? '' : finalPrice}
          onChange={(e) => Number(setFinalPrice(Number(e.target.value)))}
        />

      </div>
      {
        isLoading || isRentLoading ? <Spinner /> : viewedData.length === 0 ?
          <EmptyComponent headerText='No properties!' mainText='There are no properties posted yet. Stay Tuned!' /> :
          (
            <div className="flex flex-wrap md:flex h-full pt-8">
              <div className="w-full md:w-3/4 h-full">
                <Tabs defaultValue="Buy">
                  <TabsList className='px-10 py-8'>
                    <div className="flex space-x-4">
                      <TabsTrigger value="Buy"
                        className='text-md md:text-lg font-semibold px-4 py-2'
                        onClick={() => setFilterByCategory("Buy")}
                      >
                        Buy
                      </TabsTrigger>
                      <TabsTrigger value="Rent"
                        className='text-md md:text-lg font-semibold px-4 py-2'
                        onClick={() => setFilterByCategory("Rent")}
                      >
                        Rent
                      </TabsTrigger>
                    </div>
                  </TabsList>
                  <TabsContent value="Buy">
                    <CardList propertyPost={viewedData} />
                  </TabsContent>
                  <TabsContent value="Rent">
                    <CardList propertyPost={viewedData} />
                  </TabsContent>
                </Tabs>
              </div>
              <div className="mt-2 w-full md:w-1/4">
                <div className="bg-white p-4 rounded-lg shadow h-full">
                  <RightSideBar />
                </div>
              </div>
            </div>
          )
      }
    </div>
  );
};
