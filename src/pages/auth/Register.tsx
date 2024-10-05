import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"
import { SIGN_IN_ROUTE } from "@/router/routeConstants"
import { FormEvent, useState } from "react"
import { useAuthenticationStore } from "@/store/authentication"
import { RegisterData } from "@/store/types"
import InputField from "@/components/common/inputField"


export const Register = () => {
    const { signUp, isLoading } = useAuthenticationStore(store => store);

    const [userData, setUserData] = useState<RegisterData>({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        primaryPhoneNumber: '',
    })

    const handleInputChange = (
        e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
    ) => {
        const { name, value } = e.target;
        setUserData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }));
    };
    const handleSubmit = (event: FormEvent) => {
        event.preventDefault();
        signUp(userData);
    }
    return (
        <form className="w-4/5 lg:w-1/3 flex flex-col justify-center items-center space-y-4" onSubmit={handleSubmit}>
            <InputField
                type="text"
                name="firstName"
                value={userData.firstName}
                placeholder="First Name"
                required={true}
                handleChange={handleInputChange}
            />
            <InputField
                type="text"
                name="lastName"
                value={userData.lastName}
                placeholder="Last Name"
                required={true}
                handleChange={handleInputChange}
            />
            <InputField
                type="email"
                name="email"
                value={userData.email}
                placeholder="Email"
                required={true}
                handleChange={handleInputChange}
            />
            <InputField
                type="text"
                name="primaryPhoneNumber"
                value={userData.primaryPhoneNumber}
                placeholder="Primary Phone Number"
                required={true}
                handleChange={handleInputChange}
            />
            <InputField
                type="password"
                name="password"
                value={userData.password}
                placeholder="Password"
                required={true}
                handleChange={handleInputChange}
            />
            <InputField
                type="password"
                name="confirmPassword"
                value={userData.confirmPassword}
                placeholder="Confirm Password"
                required={true}
                handleChange={handleInputChange}
            />
            <Button type="submit" className="w-full bg-main-color hover:bg-main-hover-color px-16 py-6">{isLoading ? 'LOADING...' : 'Register'}</Button>
            <div className="w-full px-16 py-3 border border-main-color hover:bg-main-hover-color">Have an account? <Link to={SIGN_IN_ROUTE}><span className="text-main-color px-3">Login</span></Link></div>
        </form>
    )
}
