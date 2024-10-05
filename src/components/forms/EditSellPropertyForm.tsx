import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { usePropertyStore } from "@/store/property";
import { useNavigate, useParams } from 'react-router-dom';
import { useSellStore } from "@/store/sell";
import { SELL_STATUS, sellValueDeterminer } from "@/store/types/sell";
import { Sell } from "@/supabase/collections";
import { useEffect } from "react";

const schema = z.object({
    title: z.string().min(1, { message: "Title is required" }),
    description: z.string().optional(),
    price: z.number({ required_error: "Price is required" }).positive(),
    isFurnished: z.string().min(1, { message: "You need to select this value" }).
        transform(value => value.toLocaleLowerCase() === "true"),
    propertyId: z.number(),
    status: z.enum([SELL_STATUS.ACTIVE, SELL_STATUS.INACTIVE, SELL_STATUS.SOLD]),
    id: z.number()
});

type SaleFormInputs = z.infer<typeof schema>;

export const EditSellPropertyForm = () => {
    const navigate = useNavigate();
    const { id } = useParams();

    const properties = usePropertyStore(store => store.properties);

    const { isLoading, updateSell, sells } = useSellStore(store => store);

    const sellToBeUpdated: Sell = sells.find((sell) => sell.id === Number(id)) as Sell;

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue
    } = useForm<SaleFormInputs>({
        resolver: zodResolver(schema),
    });

    // Populate the form with existing data
    useEffect(() => {
        if (sellToBeUpdated) {
            setValue("title", String(sellToBeUpdated.title));
            setValue("description", String(sellToBeUpdated.description));
            setValue("price", Number(sellToBeUpdated.price));
            setValue("isFurnished", Boolean(sellToBeUpdated.isFurnished));
            setValue("propertyId", Number(sellToBeUpdated.propertyId));
            setValue("status", sellValueDeterminer(String(sellToBeUpdated.status)));
            setValue("id", Number(id));
        }
    }, [sellToBeUpdated, setValue, id]);

    return (
        <div className="p-4 md:p-6 rounded-lg shadow-lg max-w-full md:max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold mb-6 text-center">
                Update Sell Post
            </h2>
            <form onSubmit={handleSubmit((data) => updateSell(data, navigate))}>
                <div className="mb-4">
                    <select
                        {...register('propertyId')}
                        className='w-full p-2 border border-gray-300 rounded-md'
                    >
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
