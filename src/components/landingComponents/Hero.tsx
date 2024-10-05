import backImg from "../../assets/backImg.jpg";

export const Hero = () => {
    return (
        <div className="w-full h-screen relative" style={{ backgroundImage: `url(${backImg})`, backgroundSize: 'cover' }}>
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-center h-full text-center md:text-left">
                <div className="p-6 flex flex-col justify-center w-full md:w-1/2 space-y-4">
                    <h1 className="text-white text-3xl md:text-4xl lg:text-7xl lg:font-extrabold font-bold">
                        Find Your Perfect Home with Us
                    </h1>
                    <p className="text-white text-lg lg:text-2xl lg:font-semibold">
                        Discover Your Dream Home with Us - Where Perfect Meets Possible in Every Home
                    </p>
                </div>
                <div className="w-full md:w-1/3 p-8 bg-white rounded-md shadow-md">
                    <div className="flex space-x-4 mb-4">
                        <button className="text-lg font-semibold px-4 py-2 w-1/2 border-b-4 border-main-bg-main-color">
                            Rent
                        </button>
                        <button className="text-lg font-semibold px-4 py-2 w-1/2 text-gray-500">
                            Buy
                        </button>
                    </div>
                    <input type="text" placeholder="Type keyword..." className="border p-2 w-full mb-4 rounded" />
                    <select className="border p-2 w-full mb-4 rounded">
                        <option>Type</option>
                        <option>Houses</option>
                        <option>Villas</option>
                        <option>Office</option>
                        <option>Apartments</option>
                    </select>
                    <select className="border p-2 w-full mb-4 rounded">
                        <option>Location</option>
                        <option>Addis Ababa</option>
                        <option>Garji</option>
                        <option>Figa</option>
                    </select>
                    <button className="bg-main-color text-white px-4 py-2 w-full rounded">
                        Search Now
                    </button>
                </div>
            </div>
        </div>
    );
};
