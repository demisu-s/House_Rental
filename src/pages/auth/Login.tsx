import InputField from "@/components/common/inputField";
import { Button } from "@/components/ui/button"
import { DASHBOARD_ROUTE, REGISTER_ROUTE, SIGN_IN_ROUTE } from "@/router/routeConstants";
import { useAuthenticationStore } from "@/store/authentication";
import { RegisterData } from "@/store/types";
import { validator } from "@/utils/auth.validator";
import { getAccessToken } from "@/utils/localStorage";
import { useEffect, useState } from "react";
import { useNavigate, Link } from 'react-router-dom';
import { Loader2 } from "lucide-react";

export interface ValidationErrors {
    [key: string]: string;
}

export const Login = () => {
    const navigate = useNavigate();
    const { signIn, isLoading } = useAuthenticationStore(store => store);

    const token = getAccessToken();

    const [userData, setUserData] = useState<RegisterData>({ email: '', password: '' })
    const [validationError, setValidationError] = useState<ValidationErrors>();

    const handleInputChange = (
        e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
    ) => {
        const { name, value } = e.target;
        setUserData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }));
    };

    const handleLoginSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const fieldsToValidate: (keyof RegisterData)[] = ["email", "password"];
        const validate = validator(userData, fieldsToValidate);
        setValidationError(validate);
        if (Object.keys(validate).length === 0) {
            signIn(userData);
        }
    };

    useEffect(() => {
        if (token) {
            navigate(DASHBOARD_ROUTE)
        }
    }, [token, navigate])

    return (
        <form className="w-4/5 lg:w-1/3 flex flex-col justify-center items-center space-y-4" onSubmit={handleLoginSubmit}>
            <InputField
                type="email"
                name="email"
                placeholder="Email"
                value={userData.email}
                error={validationError}
                required={true}
                handleChange={handleInputChange}
            />
            <InputField
                type="password"
                name="password"
                value={userData.password}
                error={validationError}
                placeholder="Password"
                required={true}
                handleChange={handleInputChange}
            />
            <p className="w-full flex justify-end py-3">Forgot Password? <Link to={SIGN_IN_ROUTE}><span className="text-main-color pl-3">Recover</span></Link></p>
            <Button type="submit" className="w-full bg-main-color hover:bg-main-hover-color px-16 py-6">
                {isLoading && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Login
            </Button>
            <div className="w-full flex justify-center py-3 border border-main-color hover:bg-main-hover-color">Don't have an account? <Link to={REGISTER_ROUTE}><span className="text-main-color pl-3">Sign up</span></Link></div>
        </form>
    )
}
