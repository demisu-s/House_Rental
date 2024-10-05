import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { AVAILABILITY_FOR_RENT, availabilityForRentValue, PAYMENT_FREQUENCY, paymentFrequencyValue } from "@/store/types/rent";
import { usePropertyStore } from "@/store/property";
import { useNavigate, useParams } from 'react-router-dom';
import { useRentStore } from "@/store/rent";
import { Rent } from "@/supabase/collections";
import { useEffect } from "react";

const schema = z.object({
    title: z.string().min(1, { message: "Title is required" }),
    description: z.string().optional(),
    price: z.number({ required_error: "Price is required" }),
    propertyId: z.number(),
    isFurnished: z.string().min(1, { message: "You need to select this value" }).transform(value => value.toLocaleLowerCase() === "true"), // Transform string to boolean
    paymentFrequency: z.enum([
        PAYMENT_FREQUENCY.PER_MONTH,
        PAYMENT_FREQUENCY.PER_SIX_MONTHS,
        PAYMENT_FREQUENCY.PER_YEAR,
        PAYMENT_FREQUENCY.PER_THREE_MONTHS
    ]).default(PAYMENT_FREQUENCY.PER_MONTH),
    availableForRent: z.enum([
        AVAILABILITY_FOR_RENT.IMMEDIATELY,
        AVAILABILITY_FOR_RENT.AFTER_A_WEEK,
        AVAILABILITY_FOR_RENT.AFTER_A_MONTH,
        AVAILABILITY_FOR_RENT.TO_BE_DISCUSSED
    ]).default(AVAILABILITY_FOR_RENT.IMMEDIATELY),
    id: z.number(),
});

type RentFormInputs = z.infer<typeof schema>;

export const EditRentForm = () => {
    const navigate = useNavigate();
    const { id } = useParams();

    const properties = usePropertyStore(store => store.properties);
    const { isLoading, updateRent, rents } = useRentStore(store => store);

    const rentToBeUpdated: Rent = rents.find((rent) => rent.id === Number(id)) as Rent;

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue
    } = useForm<RentFormInputs>({
        resolver: zodResolver(schema),
    });

    // Populate the form with existing data
    useEffect(() => {
        if (rentToBeUpdated) {
            setValue("title", String(rentToBeUpdated.title));
            setValue("description", String(rentToBeUpdated.description));
            setValue("price", Number(rentToBeUpdated.price));
            setValue("isFurnished", Boolean(rentToBeUpdated.isFurnished));
            setValue("propertyId", Number(rentToBeUpdated.propertyId));
            setValue("paymentFrequency", paymentFrequencyValue(String(rentToBeUpdated.paymentFrequency)));
            setValue("availableForRent", availabilityForRentValue(String(rentToBeUpdated.availableForRent)));
            setValue("id", Number(id));
        }
    }, [rentToBeUpdated, setValue, id]);

    return (
        <div className="p-6 rounded-lg shadow-lg max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold mb-6 text-center">
                Edit Rent Post
            </h2>
            <form onSubmit={handleSubmit((data) => updateRent(data, navigate))}>
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
                            {...register('paymentFrequency')}
                            className='w-full p-2 border border-gray-300 rounded-md'
                        >
                            <option value={PAYMENT_FREQUENCY.PER_MONTH}>Per Month</option>
                            <option value={PAYMENT_FREQUENCY.PER_THREE_MONTHS}>Per Three Month</option>
                            <option value={PAYMENT_FREQUENCY.PER_SIX_MONTHS}>Per Six Month</option>
                            <option value={PAYMENT_FREQUENCY.PER_YEAR}>Per Year</option>
                        </select>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row md:space-x-4">
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

                    <div className="mb-4 md:w-1/2">
                        <select
                            {...register("availableForRent")}
                            className="w-full p-2 border border-gray-300 rounded-md"
                        >
                            <option value="">Time to rent</option>
                            <option value={AVAILABILITY_FOR_RENT.IMMEDIATELY}>Immediate</option>
                            <option value={AVAILABILITY_FOR_RENT.AFTER_A_WEEK}>After A Week</option>
                            <option value={AVAILABILITY_FOR_RENT.AFTER_A_MONTH}>After A Month</option>
                            <option value={AVAILABILITY_FOR_RENT.TO_BE_DISCUSSED}>To Be Discussed</option>
                        </select>
                    </div>
                </div>

                <div className="mb-4">
                    <textarea
                        {...register("description")}
                        placeholder="Write Your Requirement in detail to Renting the home"
                        className="w-full p-2 border border-gray-300 rounded-md h-32"
                    />
                    {errors.description?.message && (
                        <p className="text-red-500">{String(errors.description.message)}</p>
                    )}
                </div>


                <div>
                    <button
                        type="submit"
                        className="w-full bg-main-color text-white py-2 rounded-md hover:bg-[#33c290] transition duration-200"
                    >
                        {isLoading ? "Loading..." : "Submit"}
                    </button>
                </div>
            </form>
        </div>
    );
};
