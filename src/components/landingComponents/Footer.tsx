import { Link } from 'react-router-dom';
import { FaInstagram, FaYoutube, FaFacebook } from 'react-icons/fa';

export const Footer = () => {
    return (
        <div className="bg-gray-100 py-10 px-4 md:px-8 lg:px-16">
            <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
                <div>
                    <p className="text-gray-600 mb-4">
                        We have built our reputation as true local area experts.
                    </p>
                    <div>
                        <h4 className="font-semibold mb-2">Newsletter</h4>
                        <div className="flex">
                            <input
                                type="email"
                                placeholder="Input your email"
                                className="border border-gray-300 rounded-l px-4 py-2 focus:outline-none w-full"
                            />
                            <button className="bg-main-color text-white px-4 py-2 rounded-r">
                                Send
                            </button>
                        </div>
                    </div>
                </div>

                <div>
                    <h4 className="font-semibold mb-2">Service</h4>
                    <ul className="space-y-2">
                        <li><Link to="/about-us" className="text-gray-600">About us</Link></li>
                        <li><Link to="/careers" className="text-gray-600">Careers</Link></li>
                        <li><Link to="/terms" className="text-gray-600">Terms & Conditions</Link></li>
                        <li><Link to="/privacy" className="text-gray-600">Privacy & Policy</Link></li>
                    </ul>
                </div>

                <div>
                    <h4 className="font-semibold mb-2">Community</h4>
                    <ul className="space-y-2">
                        <li><Link to="/find-agents" className="text-gray-600">Find agents</Link></li>
                        <li><Link to="/lifestyle" className="text-gray-600">Lifestyle</Link></li>
                        <li><Link to="/legal-notice" className="text-gray-600">Legal notice</Link></li>
                    </ul>
                </div>

                <div className=''>
                    <h4 className="font-semibold mb-4">Follow us on</h4>
                    <div className="flex space-x-4">
                        <Link to="#" className="text-main-color">
                            <FaInstagram className="w-6 h-6" />
                        </Link>
                        <Link to="#" className="text-main-color">
                            <FaYoutube className="w-6 h-6" />
                        </Link>
                        <Link to="#" className="text-main-color">
                            <FaFacebook className="w-6 h-6" />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};
