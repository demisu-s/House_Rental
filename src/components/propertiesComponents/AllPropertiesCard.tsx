import { EDIT_PROPERTY_ROUTE, PROPERTY_DETAILS_ROUTE } from '@/router/routeConstants';
import { Property } from '@/supabase/collections';
import { useState } from 'react';
import { FaBed, FaBath, FaArrowsAlt, FaMapMarkerAlt, FaEllipsisV } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

interface AllPropertiesCardProps {
  homes: Property[];
}

export const AllPropertiesCard = ({ homes }: AllPropertiesCardProps) => {
  const navigate = useNavigate();
  const [dropdownOpenIndex, setDropdownOpenIndex] = useState<number | null>(null);

  const toggleDropdown = (id: number) => {
    setDropdownOpenIndex(dropdownOpenIndex === id ? null : id);
  };

  if (homes.length === 0) {
    return <p>NO DATA!</p>
  }

  return (
    <div className="h-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {
          homes.map((item) => (
            <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden"
            // onClick={() => navigate(`${PROPERTY_DETAILS_ROUTE}/${item.id}`)}
            >
              <div className="relative">
                <img
                  src={item.propertyImages![0]}
                  alt="property image"
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-4 right-4">
                  <FaEllipsisV
                    className="text-white hover:text-main-color cursor-pointer"
                    onClick={() => toggleDropdown(item.id)}
                  />
                </div>
                {dropdownOpenIndex === item.id && (
                  <div className="absolute top-10 right-4 w-32 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                    <ul className="py-1">
                      {true && (
                        <>
                          <li
                            className="px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer"
                            onClick={() => {
                              navigate(`${PROPERTY_DETAILS_ROUTE}/${item.id}`)
                            }}
                          >
                            Details
                          </li>
                          <li
                            className="px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer"
                            onClick={() => {
                              const path = `${EDIT_PROPERTY_ROUTE}/${item.id}`;
                              navigate(path);
                            }}
                          >
                            Edit
                          </li>
                          <li
                            className="px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer"
                            onClick={() => { }}
                          >
                            Delete
                          </li>
                        </>
                      )}
                    </ul>
                  </div>
                )}

              </div>

              <div className="p-4">
                <h3 className="text-lg font-semibold">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>

                <div className="flex items-center mt-4 text-gray-700">
                  <FaMapMarkerAlt className="text-main-color mr-2" />
                  <p>{`${item.country}, ${item.state}, ${item.city}`}</p>
                </div>

                <hr className="my-4" />

                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <FaBed className="text-main-color mr-2" />
                    <p>{item.numberOfBedRooms} Beds</p>
                  </div>
                  <div className="flex items-center">
                    <FaBath className="text-main-color mr-2" />
                    <p>{item.numberOfBathRooms} Baths</p>
                  </div>
                  <div className="flex items-center">
                    <FaArrowsAlt className="text-main-color mr-2" />
                    <p>{item.area} m<sup>2</sup></p>
                  </div>
                </div>
              </div>
            </div>
          ))
        }
      </div>
    </div>
  );
};
