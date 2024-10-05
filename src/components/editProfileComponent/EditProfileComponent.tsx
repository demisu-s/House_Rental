import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useNavigate } from "react-router-dom";
import { useState, ChangeEvent, useEffect } from "react";
import profileImage from "../../assets/ProfileImage.jpg";
import { useAuthenticationStore } from "@/store/authentication";
import { Spinner } from "../common/Spinner";


const schema = z.object({
    firstName: z.string().min(1, { message: "First name is required" }),
    lastName: z.string().min(1, { message: "Last name is required" }),
    email: z.string().email({ message: "Invalid email address" }),
    gender: z.enum(["male", "female"], { required_error: "Gender is required" }),
    mainPhoneNumber: z.string().min(10, { message: "Main phone number must be at least 10 digits" }),
    secondaryPhoneNumber: z.string().optional(),
    bio: z.string().optional(),
    image: z.any().optional(),
});

type ProfileFormInputs = z.infer<typeof schema>;

export const EditProfileComponent = () => {
    const userData = useAuthenticationStore(store => store.userProfile);
    const { isLoading, updateUserProfile } = useAuthenticationStore(store => store);
    const [image, setImage] = useState(userData?.imageUrl || profileImage);
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue
    } = useForm<ProfileFormInputs>({
        resolver: zodResolver(schema),
    });

    useEffect(() => {
        if (userData) {
            setValue("firstName", userData.firstName || "");
            setValue("lastName", userData.lastName || "");
            setValue("email", userData.email);
            // setValue("gender", userData.gender || "male");
            setValue("mainPhoneNumber", userData.mainPhoneNumber || "");
            setValue("secondaryPhoneNumber", userData.secondaryPhoneNumber || "");
            setValue("bio", userData.bio || "");
        }
    }, [userData, setValue]);

    const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const imageURL = URL.createObjectURL(file);
            setImage(imageURL);
            setValue("image", file);
        }
    };


    return (
        <div className="w-full p-4 sm:p-6 bg-white">
            <form onSubmit={handleSubmit((data) => {
                updateUserProfile(data, navigate);
            })}>
                <div className="flex items-center justify-center relative">
                    <img
                        src={image}
                        alt="profile"
                        className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover"
                    />
                    <label
                        htmlFor="image-upload"
                        className="absolute bottom-0 transform translate-x-1/4 translate-y-1/4"
                    >
                        <div className="bg-white w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-black cursor-pointer">
                            +
                        </div>
                    </label>
                    <input
                        id="image-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                    />
                </div>

                <div className="mt-6 sm:mt-8 grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">First Name</label>
                        <input
                            type="text"
                            {...register("firstName")}
                            placeholder="Your First Name"
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
                        />
                        {errors.firstName && <p className="text-red-500">{errors.firstName.message}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Last Name</label>
                        <input
                            type="text"
                            {...register("lastName")}
                            placeholder="Your Last Name"
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
                        />
                        {errors.lastName && <p className="text-red-500">{errors.lastName.message}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            {...register("email")}
                            placeholder="Email"
                            readOnly
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm bg-gray-100 cursor-not-allowed"
                        />
                        {errors.email && <p className="text-red-500">{errors.email.message}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Gender</label>
                        <select
                            {...register("gender")}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
                        >
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                        </select>
                        {errors.gender && <p className="text-red-500">{errors.gender.message}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Main Phone Number</label>
                        <input
                            type="tel"
                            {...register("mainPhoneNumber")}
                            placeholder="Main Phone Number"
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
                        />
                        {errors.mainPhoneNumber && <p className="text-red-500">{errors.mainPhoneNumber.message}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Secondary Phone Number</label>
                        <input
                            type="tel"
                            {...register("secondaryPhoneNumber")}
                            placeholder="Secondary Phone Number"
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
                        />
                    </div>
                    <div className="col-span-1 md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700">Bio</label>
                        <textarea
                            {...register("bio")}
                            placeholder="Tell us a little about yourself"
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm md:min-h-32"
                        />
                    </div>
                </div>

                <div className="flex justify-center mt-6">
                    <button
                        type="submit"
                        className="bg-main-color text-white px-6 py-4 rounded-md text-sm sm:text-base"
                    >
                        {isLoading ? <Spinner /> : "Submit"}
                    </button>
                </div>
            </form>
        </div>
    );
};
