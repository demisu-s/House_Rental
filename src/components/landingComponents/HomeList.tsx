
import { FaBed, FaBath, FaArrowsAlt, FaHeart } from 'react-icons/fa'; 
import Img1 from "../../assets/home3.jpg";
import Img2 from "../../assets/home8.jpg";
import Img3 from "../../assets/home7.jpg";
import Img4 from "../../assets/home6.png";
import Img5 from "../../assets/home5.png";
import Img6 from "../../assets/home4.jpg";

interface HomeItem {
  image: string;
  title: string;
  price: string;
  comment: string;
  bedrooms: string;
  bathrooms: string;
  area: string;
}

export const HomeList= () => {
  const homes: HomeItem[] = [
    {
      image: Img1,
      title: "Beverly Springfield",
      price: "$2,700",
      comment: "2821 Lake Sevilla, Palm Harbor, TX",
      bedrooms: "4",
      bathrooms: "2",
      area: "6x7.5"
    },
    {
      image: Img2,
      title: "Home 2",
      price: "$500",
      comment: "2699 Green Valley, Highland Lake, FL",
      bedrooms: "4",
      bathrooms: "2",
      area: "6x6.1"
    },
    {
      image: Img3,
      title: "Home 3",
      price: "$600",
      comment: "2699 Green Valley, Highland Lake, FL",
      bedrooms: "4",
      bathrooms: "2",
      area: "6x6.1"
    },
    {
      image: Img4,
      title: "Home 4",
      price: "$700",
      comment: "2699 Green Valley, Highland Lake, FL",
      bedrooms: "4",
      bathrooms: "2",
      area: "6x6.1"
    },
    {
      image: Img5,
      title: "Home 5",
      price: "$800",
      comment: "2699 Green Valley, Highland Lake, FL",
      bedrooms: "4",
      bathrooms: "2",
      area: "6x6.1"
    },
    {
      image: Img6,
      title: "Home 6",
      price: "$900",
      comment: "2699 Green Valley, Highland Lake, FL",
      bedrooms: "4",
      bathrooms: "2",
      area: "6x6.1"
    },
  ];

  return (
    <div className="p-8">
     <div className="flex flex-col justify-center items-center h-full">
    <h1 className="text-2xl font-bold">
        Based on your location
    </h1>
    <p className="text-lg">
        Some of our picked properties near your location.
    </p>
</div>

<div className='flex justify-center items-center h-full p-4'>
    <input
        type="search"
        placeholder="Search..."
        className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 w-full max-w-md"
    />
</div>



      <div className="home-list grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {homes.map((item, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md p-4 relative">
            <div className="relative">
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-48 object-cover rounded-t-lg"
              />
              <div className="absolute top-4 left-4 bg-main-color text-white text-xs font-bold px-2 py-1 rounded">POPULAR</div>
              <div className="absolute top-4 right-4">
                <FaHeart className="text-gray-300 hover:text-red-500 cursor-pointer" />
              </div>
            </div>
            <div className="p-4">
              <p className="text-xl font-bold">{item.price}<span className="text-mainbg-main-color">/month</span></p>
              <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
              <p className="text-gray-600">{item.comment}</p>
              <hr className="my-4"/>
              <div className="flex items-center space-x-2 text-gray-700">
                <div className="flex justify-center items-center">
                  <FaBed className="text-mainbg-main-color mr-1" />
                  <p className="font-semibold">{item.bedrooms} <span className='font-normal'>Beds</span> </p>
                </div>
                <div className="flex items-center">
                  <FaBath className="text-mainbg-main-color mr-1" />
                  <p className="font-semibold">{item.bathrooms} <span className='font-normal'>Bathrooms</span></p>
                </div>
                <div className="flex items-center">
                  <FaArrowsAlt className="text-mainbg-main-color mr-1" />
                  <p className="font-semibold">{item.area} <span className='font-normal'>m<sup>2</sup></span> </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className=" flex justify-center items-center py-4">
  <button className="text-white bg-main-color font-bold py-2 px-4 rounded hover:bg-[#57a687] transition duration-200">
    Browse more homes
  </button>
</div>

    </div>
  );
};
