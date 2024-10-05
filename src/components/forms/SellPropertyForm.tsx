import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { usePropertyStore } from "@/store/property";
import { useNavigate } from 'react-router-dom';
import { useSellStore } from "@/store/sell";
import { SELL_STATUS } from "@/store/types/sell";

// Zod schema for form validation
const schema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  description: z.string().optional(),
  price: z.number({ required_error: "Price is required" }).positive(),
  isFurnished: z.string().min(1, { message: "You need to select this value" }).transform(value => value.toLocaleLowerCase() === "true"), // Transform string to boolean
  propertyId: z.string()
    .min(1, { message: "You need to select a Property" })
    .transform(value => parseInt(value, 10)),
  status: z.enum([SELL_STATUS.ACTIVE, SELL_STATUS.INACTIVE, SELL_STATUS.SOLD]).default(SELL_STATUS.ACTIVE)
});

type SaleFormInputs = z.infer<typeof schema>;

export const SellPropertyForm = () => {
  const navigate = useNavigate();

  const properties = usePropertyStore(store => store.properties);
  const { isLoading, createSell } = useSellStore(store => store);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SaleFormInputs>({
    resolver: zodResolver(schema),
  });

  return (
    <div className="p-4 md:p-6 rounded-lg shadow-lg max-w-full md:max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center">
        New Sell Post
      </h2>
      <form onSubmit={handleSubmit((data) => createSell(data, navigate))}>
        <div className="mb-4">
          <select
            {...register('propertyId')}
            className='w-full p-2 border border-gray-300 rounded-md'
          >
            <option value="">Select a Property</option>
            {
              properties.map(property => (
                <option key={property.id} value={property.id.toString()}>{property.title}</option>
              ))
            }
          </select>
          {errors.propertyId?.message && (
            <p className="text-red-500">{String(errors.propertyId.message)}</p>
          )}
        </div>
        <div className="mb-4">
          <input
            {...register("title")}
            placeholder="Title"
            className="w-full p-2 border border-gray-300 rounded-md"
          />
          {errors.title?.message && (
            <p className="text-red-500">{String(errors.title.message)}</p>
          )}
        </div>

        <div className="flex flex-col md:flex-row md:space-x-4">
          <div className="mb-4 md:w-1/2">
            <input
              type="number"
              {...register("price", { valueAsNumber: true })}
              placeholder="Price"
              className="w-full p-2 border border-gray-300 rounded-md"
            />
            {errors.price?.message && (
              <p className="text-red-500">{String(errors.price.message)}</p>
            )}
          </div>

          <div className='mb-4 md:w-1/2'>
            <select
              {...register('isFurnished')}
              className='w-full p-2 border border-gray-300 rounded-md'
            >
              <option value="">Furniture status</option>
              <option value="true">Fully Furnished</option>
              <option value="false">Unfurnished</option>
            </select>
            {errors.isFurnished?.message && (
              <p className="text-red-500">{String(errors.isFurnished.message)}</p>
            )}
          </div>
        </div>

        <div className="mb-4">
          <textarea
            {...register("description")}
            placeholder="Write Your Requirement in detail to Selling the home"
            className="w-full p-2 border border-gray-300 rounded-md h-32"
          />
          {errors.description?.message && (
            <p className="text-red-500">{String(errors.description.message)}</p>
          )}
        </div>

        <div>
          <button
            type="submit"
            className="w-full bg-main-color text-white py-2 rounded-md hover:bg-[#33c290] transition duration-2000"
          >
            {
              isLoading ? "Loading..." : "Submit"
            }
          </button>
        </div>
      </form>
    </div>
  );
};
