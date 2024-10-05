import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import Dropzone from 'react-dropzone';
import { LatLngExpression } from 'leaflet';
import { usePropertyStore } from '@/store/property';
import { NewProperty, PROPERTY_STATUS, PROPERTY_TYPE } from '@/store/types/property';
import * as z from 'zod';
import { useNavigate } from 'react-router-dom';
import { Spinner } from '../common/Spinner';

// Zod schema for form validation
const schema = zodResolver(z.object({
  title: z.string().min(1, { message: 'Title is required' }),
  country: z.string().min(1, { message: 'Country is required' }),
  state: z.string().min(1, { message: 'State is required' }),
  city: z.string().min(1, { message: 'City is required' }),
  street: z.string().min(1, { message: 'Street is required' }),
  description: z.string().optional(),
  numberOfBedRooms: z.number({ required_error: 'Number of bedrooms is required' }).min(1),
  numberOfBathRooms: z.number({ required_error: 'Number of bathrooms is required' }).min(1),
  area: z.number().min(1, { message: 'Area must be greater than 0' }),
  type: z.string().min(1, { message: 'Type is required' }),
  isFurnished: z.boolean(),
  haveParking: z.boolean(),
  status: z.string().min(1, { message: 'Status is required' }),
  images: z.array(z.any()).nonempty({ message: 'At least one image is required' }),
  location: z.object({
    lat: z.number(),
    lng: z.number(),
  }).optional(),
}));

const center: LatLngExpression = [51.505, -0.09];

export const AddPropertyForm = () => {
  const navigate = useNavigate()
  const { isLoading, createProperty } = usePropertyStore((store) => store);
  const { register, handleSubmit, formState: { errors }, setValue } = useForm<NewProperty>({
    resolver: schema,
  });

  const [position, setPosition] = useState<{ lat: number, lng: number } | null>(null);
  const [previews, setPreviews] = useState<string[]>([]);

  const onDrop = (acceptedFiles: File[]) => {
    setValue('images', acceptedFiles);

    // Generate image previews
    const previewUrls = acceptedFiles.map((file) => URL.createObjectURL(file));
    setPreviews(previewUrls);
  };

  const MapClickHandler = () => {
    useMapEvents({
      click(e) {
        setPosition(e.latlng);
        setValue('location', e.latlng);
      },
    });
    return null;
  };

  return (
    <div className='p-4 md:p-6 rounded-lg shadow-md max-w-full md:max-w-4xl mx-auto'>
      <h2 className='text-2xl font-bold mb-6 text-center'>Add New Home</h2>
      <form onSubmit={handleSubmit((data) => {
        createProperty(data, navigate);
      })}>
        <div className='mb-4'>
          <input
            {...register('title')}
            placeholder='Title'
            className='w-full p-2 border border-gray-300 rounded-md'
            
          />
          {errors.title?.message && <p className='text-red-500'>{errors.title.message}</p>}
        </div>

        <div className='flex flex-col md:flex-row md:space-x-4'>
          <div className='mb-4 md:w-1/2'>
            <input
              {...register('country')}
              placeholder='Country'
              className='w-full p-2 border border-gray-300 rounded-md'
            />
            {errors.country?.message && <p className='text-red-500'>{errors.country.message}</p>}
          </div>

          <div className='mb-4 md:w-1/2'>
            <input
              {...register('state')}
              placeholder='State'
              className='w-full p-2 border border-gray-300 rounded-md'
            />
            {errors.state?.message && <p className='text-red-500'>{errors.state.message}</p>}
          </div>
        </div>

        <div className='flex flex-col md:flex-row md:space-x-4'>
          <div className='mb-4 md:w-1/2'>
            <input
              {...register('city')}
              placeholder='City'
              className='w-full p-2 border border-gray-300 rounded-md'
            />
            {errors.city?.message && <p className='text-red-500'>{errors.city.message}</p>}
          </div>

          <div className='mb-4 md:w-1/2'>
            <input
              {...register('street')}
              placeholder='Street'
              className='w-full p-2 border border-gray-300 rounded-md'
            />
            {errors.street?.message && <p className='text-red-500'>{errors.street.message}</p>}
          </div>
        </div>

        <div className='flex flex-col md:flex-row md:space-x-4'>
          <div className='mb-4 md:w-1/2'>
            <input
              type="number"
              {...register('numberOfBedRooms', { valueAsNumber: true })}
              placeholder='Number of Bedrooms'
              className='w-full p-2 border border-gray-300 rounded-md'
            />
            {errors.numberOfBedRooms?.message && <p className='text-red-500'>{errors.numberOfBedRooms.message}</p>}
          </div>

          <div className='mb-4 md:w-1/2'>
            <input
              type="number"
              {...register('numberOfBathRooms', { valueAsNumber: true })}
              placeholder='Number of Bathrooms'
              className='w-full p-2 border border-gray-300 rounded-md'
            />
            {errors.numberOfBathRooms?.message && <p className='text-red-500'>{errors.numberOfBathRooms.message}</p>}
          </div>
        </div>

        <div className='mb-4'>
          <input
            type="number"
            {...register('area', { valueAsNumber: true })}
            placeholder='Area in square meters'
            className='w-full p-2 border border-gray-300 rounded-md'
          />
          {errors.area?.message && <p className='text-red-500'>{errors.area.message}</p>}
        </div>

        <div className='flex flex-col md:flex-row md:space-x-4'>
          <div className='mb-4 md:w-1/2'>
            <select
              {...register('type')}
              className='w-full p-2 border border-gray-300 rounded-md'
            >
              <option value="">Select Type</option>
              <option value={PROPERTY_TYPE.APARTMENT}>Apartment</option>
              <option value={PROPERTY_TYPE.CONDOMINIUM}>Condominium</option>
              <option value={PROPERTY_TYPE.HOUSE}>House</option>
              <option value={PROPERTY_TYPE.VILLA}>Villa</option>
            </select>
            {errors.type?.message && <p className='text-red-500'>{errors.type.message}</p>}
          </div>

          <div className='mb-4 md:w-1/2'>
            <select
              {...register('status')}
              className='w-full p-2 border border-gray-300 rounded-md'
            >
              <option value="">Select Status</option>
              <option value={PROPERTY_STATUS.READY_FOR_RENT}>Available for Rent</option>
              <option value={PROPERTY_STATUS.READY_FOR_SELL}>Available for Sale</option>
              <option value={PROPERTY_STATUS.IN_MAINTENANCE}>In Maintenance</option>
              <option value={PROPERTY_STATUS.ACTIVE}>Active</option>
            </select>
            {errors.status?.message && <p className='text-red-500'>{errors.status.message}</p>}
          </div>
        </div>

        <div className='flex flex-col md:flex-row md:space-x-4'>
          <div className='mb-4 md:w-1/2'>
            <label>
              <input
                type="checkbox"
                {...register('isFurnished')}
              />
              <span className="ml-2">Is Furnished</span>
            </label>
          </div>

          <div className='mb-4 md:w-1/2'>
            <label>
              <input
                type="checkbox"
                {...register('haveParking')}
              />
              <span className="ml-2">Has Parking</span>
            </label>
          </div>
        </div>

        <div className='mb-4'>
          <textarea
            {...register('description')}
            placeholder='Description'
            className='w-full p-2 border border-gray-300 rounded-md'
          />
          {errors.description?.message && <p className='text-red-500'>{errors.description.message}</p>}
        </div>

        <div className='mb-4'>
          <label className='block mb-2 font-semibold text-gray-700'>Upload Images</label>
          <Dropzone onDrop={onDrop} accept={{ 'image/*': [] }}>
            {({ getRootProps, getInputProps }) => (
              <div
                {...getRootProps()}
                className='w-full p-6 border-2 border-dashed border-gray-400 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition duration-200 ease-in-out flex flex-col items-center'
              >
                <input {...getInputProps()} />
                <svg
                  className="w-12 h-12 mb-2 text-gray-400 hover:text-gray-600 transition duration-200 ease-in-out"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 16v4a2 2 0 002 2h14a2 2 0 002-2v-4M16 7l-4-4m0 0L8 7m4-4v18"
                  />
                </svg>
                <p className="text-gray-600 hover:text-gray-800 transition duration-200 ease-in-out">
                  Drag & drop images here, or click to select files
                </p>
              </div>
            )}
          </Dropzone>

          {previews.length > 0 && (
            <div className="mt-4 grid grid-cols-2 gap-4">
              {previews.map((preview, index) => (
                <div key={index} className="relative w-full h-32">
                  <img
                    src={preview}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-full object-cover rounded-md"
                  />
                </div>
              ))}
            </div>
          )}
          {errors.images?.message && <p className='text-red-500 mt-2'>{errors.images.message}</p>}
        </div>

        <div className='mb-4'>
        <label className="block mb-2" htmlFor="map">Location</label>

        <div
                        id="map"
                        className="w-full h-64 rounded-md mb-4 leaflet-container"
                        aria-label="Map showing location"
                    >
          <MapContainer
            center={center}
            zoom={13}
            className='w-full h-64 rounded-md mb-4'
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {position && <Marker position={position} />}
            <MapClickHandler />
          </MapContainer>
          </div>
          {errors.location?.message && <p className='text-red-500'>{errors.location.message}</p>}
        </div>

        <div>
          <button
            type="submit"
            className='w-full bg-main-color text-white py-2 rounded-md hover:bg-[#33c290] transition duration-200'
          >
            {isLoading ? <Spinner /> : 'Submit'}
          </button>
        </div>
      </form>
    </div>
  );
};
