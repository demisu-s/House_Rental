import { CarouselImages } from "@/components/common/CarauselImages";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { FaBed, FaBath, FaCar, FaBuilding, FaChair } from 'react-icons/fa';
import { Property } from "@/supabase/collections";

interface PropertyDetailsProp {
    property: Property;
}

export const PropertyDetailComponent = ({ property }: PropertyDetailsProp) => {

    const position: [number, number] = [Number(property.latitude), Number(property.longitude)];

    return (
        <div className="p-4 md:p-10 space-y-4 h-full">
            <div className="flex justify-center items-center">
                <h1 className="text-2xl md:text-3xl font-bold text-center">{property.title}</h1>
            </div>

            <div className="w-full md:w-full">
                <CarouselImages images={property.propertyImages ?? []} />
            </div>

            <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 p-4 space-y-8 bg-white rounded-md">
                    <p className="text-lg font-normal">{property.description}</p>
                    <div className="grid grid-cols-2 gap-4 text-gray-600">
                        <div className="flex items-center">
                            <FaBed className="mr-2 text-main-color" />
                            <p className="font-semibold">{property.numberOfBedRooms} Bedrooms</p>
                        </div>
                        <div className="flex items-center">
                            <FaBath className="mr-2 text-main-color" />
                            <p className="font-semibold">{property.numberOfBathRooms} Bathrooms</p>
                        </div>
                        <div className="flex items-center">
                            <FaChair className="mr-2 text-main-color" />
                            <p className="font-semibold">{property.isFurnished ? "Yes" : "No"}</p>
                        </div>
                        <div className="flex items-center">
                            <FaCar className="mr-2 text-main-color" />
                            <p className="font-semibold">{property.haveParking ? "Yes" : "No"}</p>
                        </div>
                        <div className="flex items-center">
                            <FaBuilding className="mr-2 text-main-color" />
                            <p className="font-semibold">{property.area}m<sup>2</sup> Area</p>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col md:flex-1 h-64 rounded-lg shadow-md">
                    <MapContainer center={position} zoom={13} style={{ height: '100%', width: '100%' }}>
                        <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        />
                        <Marker position={position}>
                            <Popup>
                                {property.title} located at {property.city}
                            </Popup>
                        </Marker>
                    </MapContainer>
                </div>
            </div>
        </div>
    );
};
