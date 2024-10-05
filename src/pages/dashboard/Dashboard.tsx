import { CardComponent } from "@/components";

export const Dashboard = () => {

    return (
        <div className="flex flex-col space-y-4">
            <h1 className="text-4xl font-bold">Find Your Dream House</h1>
            <CardComponent />
        </div>
    );
}