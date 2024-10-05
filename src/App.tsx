import { useInitializeProperties } from "@/hooks/useInitializeProperties";
import { RouterProvider } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { router } from "./router/Router";

const App = () => {
    useInitializeProperties();

    return (
        <>
            <ToastContainer />
            <RouterProvider router={router} />
        </>
    );
};

export default App;
