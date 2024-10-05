
import { FaMapMarkerAlt, FaBath, FaHome, FaBed, FaCar } from 'react-icons/fa';
import Img2 from '@/assets/home8.jpg';
import { RentData } from '@/store/types/rent';
import { SellData } from '@/store/types/sell';
import { useNavigate } from 'react-router-dom';
import { RENT_DETAILS_ROUTE, SELL_DETAILS_ROUTE } from '@/router/routeConstants';
import { isRentData } from '@/utils/service';

interface CardListProps {
  propertyPost: (RentData | SellData)[];
}

export const CardList = ({ propertyPost }: CardListProps) => {
  const navigate = useNavigate();

  if (propertyPost.length === 0) {
    return <p>No DATA!</p>
  }

  return (
    <div className='h-full'>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-1">
        {propertyPost.map((item, index) => (
          index % 6 === 0 && index > 6 ? (
            <div className='flex flex-col md:flex-row bg-white rounded-lg p-2 shadow-md'
              onClick={() => {
                const path = `${isRentData(item) ? RENT_DETAILS_ROUTE : SELL_DETAILS_ROUTE}/${item.id}`
                navigate(path)
              }}
            >
              <div className='w-full md:w-2/5 rounded-lg overflow-hidden'>
                <img className='w-full h-full object-cover'
                  src={item.propertyImages ? item.propertyImages[0] : Img2}
                  alt="Property" />
              </div>
              <div className='w-3/4 md:w-3/5 pl-4 flex flex-col justify-between'>
                <div>
                  <h1 className='text-2xl font-bold'>$32,000/ Year</h1>
                  <p className='text-gray-600'><FaMapMarkerAlt className='inline-block text-main-color mr-1' /> Doane Street, Fremont CA 94538</p>
                </div>
                <div>
                  <h2 className='text-lg font-semibold mb-2'>Overview</h2>
                  <div className='grid grid-cols-2 gap-4'>
                    <div className='flex items-center mb-1'>
                      <FaBed className='text-main-color mr-2' />
                      <span className='mr-2'>Bedroom</span>
                      <span className='font-bold'>{item.numberOfBedRooms}</span>
                    </div>
                    <div className='flex items-center mb-1'>
                      <FaBath className='text-[#FF5722] mr-2' />
                      <span className='mr-2'>Bath</span>
                      <span className='font-bold'>{item.numberOfBathRooms}</span>
                    </div>
                    <div className='flex items-center mb-1'>
                      <FaCar className='text-main-color mr-2' />
                      <span className='mr-2'>Parking</span>
                      <span className='font-bold'>{item.haveParking ? 'Yes' : 'No'}</span>
                    </div>
                    <div className='flex items-center mb-1'>
                      <FaHome className='text-main-color mr-2' />
                      <span className='mr-2'>Type</span>
                      <span className='font-bold'>{item.type}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div key={item.id} className="bg-white rounded-lg shadow-md p-4"
              onClick={() => {
                const path = `${isRentData(item) ? RENT_DETAILS_ROUTE : SELL_DETAILS_ROUTE}/${item.id}`
                navigate(path)
              }}
            >
              <div className="relative">
                <img
                  src={item.propertyImages ? item.propertyImages[0] : ""} //TODO: handle this image case
                  alt={"Property Image"}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
              </div>
              <div className="p-4">
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-xl font-bold">{item.price}</p>
                <div className="flex items-center">
                  <FaMapMarkerAlt className="text-main-color mr-1" />
                  <p>{item.country}</p>
                </div>
              </div>
            </div>
          )
        ))}
      </div>
    </div >
  );
};
