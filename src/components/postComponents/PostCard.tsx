import { FaBed, FaBath, FaEllipsisV, FaArrowsAlt, FaMapMarkerAlt } from 'react-icons/fa';
import { useState } from 'react';
import { SellData } from '@/store/types/sell';
import { useNavigate } from 'react-router-dom';
import { RentData } from '@/store/types/rent';
import { EDIT_RENT_ROUTE, EDIT_SELL_ROUTE, RENT_DETAILS_ROUTE, SELL_DETAILS_ROUTE } from '@/router/routeConstants';
import { isRentData } from '@/utils/service';
import EmptyComponent from '../common/EmptyComponent';
import Img from "@/assets/home2.jpg";
import { useSellStore } from '@/store/sell';
import { Spinner } from '../common/Spinner';
import { useRentStore } from '@/store/rent';

interface AllPropertiesCardProps {
  homes: (RentData | SellData)[];
  filterStatus: string;
}

export const PostCard = ({ homes, filterStatus }: AllPropertiesCardProps) => {
  const navigate = useNavigate();
  const { isLoading, restoreSell, archiveSell } = useSellStore(store => store);
  const { isLoading: rentLoading, restoreRent, archiveRent } = useRentStore(store => store);

  const [dropdownOpenIndex, setDropdownOpenIndex] = useState<number | null>(null);
  const [operationId, setOperationId] = useState<number | null>(null);

  const toggleDropdown = (index: number) => {
    setDropdownOpenIndex(dropdownOpenIndex === index ? null : index);
  };


  const filteredHomes = homes.filter((home) => {
    if (filterStatus === 'ALL') return true;
    else if (filterStatus === "Active") return home.isDeleted === false || home.isDeleted === null;
    else if (filterStatus === "Archive") return home.isDeleted === true;
    else return true;
  });

  if (filteredHomes.length === 0) {
    return <EmptyComponent />;
  }

  return (
    <div className="h-full">
      <div className="home-list grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredHomes.map((item, index) => (
          <div key={item.id} className="bg-white rounded-lg shadow-md p-4 relative">
            {(isLoading || rentLoading) && operationId === item.id ? (
              <Spinner />
            ) : (
              <>
                <div className="relative">
                  <img
                    src={item.propertyImages ? item.propertyImages[0] : Img}
                    alt={"property image"}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                  <div className={`absolute bottom-4 left-4 ${item.isDeleted === true ? 'bg-red-500' : 'bg-main-color'} text-white text-xs font-bold px-2 py-1 rounded`}>
                    {item.isDeleted === true ? "DELETED" : "ACTIVE"}
                  </div>
                  <div className="absolute top-4 right-4">
                    <FaEllipsisV
                      className="text-white hover:text-main-color cursor-pointer"
                      onClick={() => toggleDropdown(index)}
                    />
                  </div>
                  {dropdownOpenIndex === index && (
                    <div className="absolute top-10 right-4 w-32 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                      <ul className="py-1">
                        {item.isDeleted === false || item.isDeleted === null ? (
                          <>
                            <li
                              className="px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer"
                              onClick={() => {
                                const path = `${isRentData(item) ? RENT_DETAILS_ROUTE : SELL_DETAILS_ROUTE}/${item.id}`;
                                navigate(path);
                              }}
                            >
                              Details
                            </li>
                            <li
                              className="px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer"
                              onClick={() => {
                                const path = `${isRentData(item) ? EDIT_RENT_ROUTE : EDIT_SELL_ROUTE}/${item.id}`;
                                navigate(path);
                              }}
                            >
                              Edit
                            </li>
                            <li
                              className="px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer"
                              onClick={() => {
                                setOperationId(item.id)
                                if (isRentData(item)) {
                                  archiveRent(item.id)
                                } else {
                                  archiveSell(item.id)
                                }
                              }}
                            >
                              Delete
                            </li>
                          </>
                        ) : (
                          <>
                            <li
                              className="px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer"
                              onClick={() => {
                                const path = `${isRentData(item) ? RENT_DETAILS_ROUTE : SELL_DETAILS_ROUTE}/${item.id}`;
                                navigate(path);
                              }}
                            >
                              Details
                            </li>
                            <li
                              className="px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer"
                              onClick={() => {
                                setOperationId(item.id)
                                if (isRentData(item)) {
                                  restoreRent(item.id)
                                } else {
                                  restoreSell(item.id)
                                }
                              }}
                            >
                              Restore
                            </li>
                          </>
                        )}
                      </ul>
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                  <div className="flex items-center mb-2">
                    <FaMapMarkerAlt className="text-main-color mr-1" />
                    <p>{item.country}</p>
                  </div>
                  <div className="flex items-center mb-2">
                    <FaBed className="text-main-color mr-2" />
                    <p className="font-semibold">{item.isFurnished ? "Fully Furnished" : "Not Furnished"}</p>
                  </div>
                  <hr className="my-4" />
                  <div className="flex items-center space-x-2 text-gray-700">
                    <div className="flex justify-center items-center">
                      <FaBed className="text-main-color mr-1" />
                      <p className="font-semibold">{item.numberOfBedRooms} <span className='font-normal'>Beds</span></p>
                    </div>
                    <div className="flex items-center">
                      <FaBath className="text-main-color mr-1" />
                      <p className="font-semibold">{item.numberOfBathRooms} <span className='font-normal'>Bathrooms</span></p>
                    </div>
                    <div className="flex items-center">
                      <FaArrowsAlt className="text-main-color mr-1" />
                      <p className="font-semibold">{item.area} <span className='font-normal'>m<sup>2</sup></span></p>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
