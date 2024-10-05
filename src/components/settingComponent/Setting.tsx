import { EDIT_PROFILE_ROUTE } from "@/router/routeConstants";
import { useNavigate } from "react-router-dom";
import profileImage from "../../assets/ProfileImage.jpg";
import { useAuthenticationStore } from "@/store/authentication";
import { capitalizeFirstLetter } from "@/utils/service";
import { AvatarComponent } from "../common/AvatarComponent";

export const Setting = () => {
    const navigate = useNavigate();
    const userData = useAuthenticationStore(store => store.userProfile)

    return (
        <div className="w-full p-4 sm:p-6 bg-white">
            <div className="flex flex-col sm:flex-row items-center justify-between">
                <div className="flex items-center mb-4 sm:mb-0">
                    <AvatarComponent
                        imageLocation={userData?.imageUrl ? userData.imageUrl : profileImage}
                        classNames="w-40 h-40"
                    />
                </div>

                <button
                    className="bg-main-color text-white px-6 py-4 rounded-md text-sm sm:text-base"
                    onClick={() => navigate(EDIT_PROFILE_ROUTE)}
                >
                    Edit
                </button>
            </div>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700">First Name</label>
                    <input
                        type="text"
                        placeholder="Your First Name"
                        value={capitalizeFirstLetter(userData?.firstName ?? '')}
                        readOnly
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm bg-gray-100 cursor-not-allowed"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Last Name</label>
                    <input
                        placeholder="Your Last Name"
                        value={capitalizeFirstLetter(userData?.lastName ?? "")}
                        readOnly
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm bg-gray-100 cursor-not-allowed"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <input
                        value={userData?.email ?? ""}
                        readOnly
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm bg-gray-100 cursor-not-allowed"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Gender</label>
                    <select
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm bg-gray-100 cursor-not-allowed"
                        disabled
                    >
                        <option value="male" selected>Male</option>
                        <option value="female">Female</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Main Phone Number</label>
                    <input
                        type="tel"
                        placeholder="Main Phone Number"
                        value={userData?.mainPhoneNumber ?? ""}
                        readOnly
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm bg-gray-100 cursor-not-allowed"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Secondary Phone Number</label>
                    <input
                        type="tel"
                        placeholder="Secondary Phone Number"
                        value={userData?.secondaryPhoneNumber ?? ""}
                        readOnly
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm bg-gray-100 cursor-not-allowed"
                    />
                </div>
                <div className="col-span-1 md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Bio</label>
                    <textarea
                        placeholder="Tell us a little about yourself"
                        value={userData?.bio ?? ""}
                        readOnly
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm bg-gray-100 cursor-not-allowed md:min-h-32"
                    />
                </div>
            </div>
        </div>
    );
};
