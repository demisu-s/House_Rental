import kom from '../../assets/kom1.png';
import Ellipse3 from '../../assets/Ellipse3.png';

export const Testimonial = () => {
    return (
        <div className="bg-white py-12 px-4 md:px-8 lg:px-16">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <h2 className="text-main-color text-sm font-semibold">CUSTOMER TESTIMONIAL</h2>
                    <h3 className="text-3xl font-bold text-gray-800">People say about us?</h3>
                    <a href="#" className="text-main-color text-sm float-right">Learn More</a>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="border rounded-lg p-6 shadow-lg">
                        <div className="flex items-center mb-4">
                            <img src={kom} alt="quote" className="w-6 h-6 mr-2" />
                            <p className="text-lg font-semibold">It proved to be exactly the kind of home we wanted.</p>
                        </div>
                        <p className="text-gray-600 mb-4">
                            We wish to express our thanks for your hard work in finding us a temporary home, which proved to be exactly what we wanted.
                        </p>
                        <div className="flex items-center">
                            <img src={Ellipse3} alt="Jaydon Aminoff" className="w-10 h-10 rounded-full mr-4" />
                            <div>
                                <p className="text-gray-800 font-semibold">Jaydon Aminoff</p>
                                <p className="text-gray-500">UX Designer</p>
                            </div>
                        </div>
                    </div>
                    <div className="border rounded-lg p-6 shadow-lg">
                        <div className="flex items-center mb-4">
                            <img src={kom} alt="quote" className="w-6 h-6 mr-2" />
                            <p className="text-lg font-semibold">Nobody knows Portland and the peninsula better than David.</p>
                        </div>
                        <p className="text-gray-600 mb-4">
                            My wife and I had a dream of downsizing from our house in Cape Elizabeth into a small condo closer to where we work and play in Portland.
                        </p>
                        <div className="flex items-center">
                            <img src={Ellipse3} alt="Alfredo Donin" className="w-10 h-10 rounded-full mr-4" />
                            <div>
                                <p className="text-gray-800 font-semibold">Alfredo Donin</p>
                                <p className="text-gray-500">UI Designer</p>
                            </div>
                        </div>
                    </div>
                    <div className="border rounded-lg p-6 shadow-lg">
                        <div className="flex items-center mb-4">
                            <img src={kom} alt="quote" className="w-6 h-6 mr-2" />
                            <p className="text-lg font-semibold">He keeps his client’s best interests in sharp focus</p>
                        </div>
                        <p className="text-gray-600 mb-4">
                            After working with David to sell my home in 2013, I was convinced that he's the only realtor I'll ever need. Since then, I've bought two properties and sold one.
                        </p>
                        <div className="flex items-center">
                            <img src={Ellipse3} alt="Makenna Korsgaard" className="w-10 h-10 rounded-full mr-4" />
                            <div>
                                <p className="text-gray-800 font-semibold">Makenna Korsgaard</p>
                                <p className="text-gray-500">UX Researcher</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
