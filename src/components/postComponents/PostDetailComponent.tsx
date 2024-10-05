import { CarouselImages } from "@/components/common/CarauselImages";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { FaBed, FaBath, FaCar, FaBuilding, FaChair, FaSalesforce } from 'react-icons/fa';
import profileImage from "../../assets/ProfileImage.jpg";
import { useParams } from "react-router-dom";
import { usePostDetailsData } from "@/hooks/usePostDetailsData";
import { useAuthenticationStore } from "@/store/authentication";

interface PostDetailsProps {
    page: string;
}

export const PostDetailComponent = ({ page }: PostDetailsProps) => {
    const { id } = useParams();
    const { data } = usePostDetailsData({ page, id: Number(id) })
    const userProfile = useAuthenticationStore(store => store.userProfile);


    const position: [number, number] = [Number(data.latitude), Number(data.longitude)];

    return (
        <div className="p-4 md:p-10 space-y-4 h-full">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl md:text-3xl font-bold">{data.title}</h1>
                <button className="bg-red-500 rounded-md text-white text-sm py-4 px-6">
                    {page === "RENT" ? "For Rent" : "For Sale"}
                </button>
            </div>

            <div className="flex flex-col md:flex-row gap-4">
                <div className="p-4 space-y-8 flex-1 bg-white rounded-md">
                    <div className="flex justify-between">
                        <h2 className="text-lg font-semibold">Post Detail</h2>
                        <h1 className="font-bold text-lg">
                            {page === "RENT" ? (
                                <span>
                                    ${data.price}/<span className="text-lg text-mainbg-main-color">Month</span>
                                </span>
                            ) : (
                                <span>${data.price}</span>
                            )}
                        </h1>
                    </div>
                    <p className="text-lg font-normal">{data.description}</p>
                    <div className="flex-col xs:text-md grid grid-cols-2 gap-4 text-gray-600">
                        <div className="flex items-center">
                            <FaBed className="mr-2 text-mainbg-main-color" />
                            <p className="font-semibold">{data.numberOfBedRooms} Bedrooms</p>
                        </div>
                        <div className="flex items-center">
                            <FaBath className="mr-2 text-mainbg-main-color" />
                            <p className="font-semibold">{data.numberOfBathRooms} Bathrooms</p>
                        </div>
                        <div className="flex items-center">
                            <FaChair className="mr-2 text-mainbg-main-color" />
                            <p className="font-semibold">{data.isFurnished ? "Fully Furnished" : "Unfurnished"}</p>
                        </div>
                        <div className="flex items-center">
                            <FaCar className="mr-2 text-mainbg-main-color" />
                            <p className="font-semibold">{data.haveParking ? "Yes" : "No"}</p>
                        </div>
                        <div className="flex items-center">
                            <FaBuilding className="mr-2 text-mainbg-main-color" />
                            <p className="font-semibold">{data.area}m<sup>2</sup> Area</p>
                        </div>
                        <div className="flex items-center">
                            <FaSalesforce className="mr-2 text-mainbg-main-color" />
                            <p className="font-semibold">{data.status}</p>
                        </div>
                    </div>
                    <hr />
                    <div className="flex items-center space-x-4 p-4 rounded-md ">
                        <img
                            src={userProfile?.imageUrl ? userProfile?.imageUrl : profileImage}
                            alt="profile image"
                            className="w-20 h-20 rounded-full"
                        />
                        <div>
                            <h3 className="text-lg font-bold">{`${userProfile?.firstName}  ${userProfile?.lastName}`}</h3>
                            <p className="text-sm text-gray-500">{userProfile?.email}</p>
                        </div>
                        <button className="ml-auto bg-main-color text-white py-2 px-4 rounded-full">Contact Now</button>
                    </div>
                </div>

                <div className="w-full md:w-1/2">
                    <CarouselImages images={data.propertyImages ?? []} />
                </div>
            </div>

            <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 bg-white p-4 rounded-md shadow-md">
                    <h1 className="text-lg font-semibold mb-2">Description</h1>
                    <p>{data.description}</p>
                    <h4 className="font-bold mt-4">Contact Me</h4>
                    <p>{userProfile?.mainPhoneNumber}</p>
                    <p>{userProfile?.secondaryPhoneNumber}</p>
                </div>
                <div className="flex flex-col md:flex-1 h-64 rounded-lg shadow-md">
                    <MapContainer center={position} zoom={13} style={{ height: '100%', width: '100%' }}>
                        <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        />
                        <Marker position={position}>
                            <Popup>
                                {data.title} located at {data.city}
                            </Popup>
                        </Marker>
                    </MapContainer>
                </div>
            </div>
        </div>
    );
};
