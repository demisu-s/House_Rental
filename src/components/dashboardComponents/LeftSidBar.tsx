import ProfileImage from '@/assets/ProfileImage.jpg';
import { NavLink } from 'react-router-dom';
import { FaTachometerAlt, FaBars, FaChartBar, FaCog, FaQuestionCircle, FaSignOutAlt } from 'react-icons/fa';
import { useState } from 'react';
import { DASHBOARD_ROUTE, POSTS_ROUTE, PROPERTIES_ROUTE, SETTINGS_ROUTE } from '@/router/routeConstants';
import { useAuthenticationStore } from '@/store/authentication';

export const LeftSideBar = () => {

  const signOut = useAuthenticationStore((store) => store.signOut)

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);


  const navLinkClasses = ({ isActive }: { isActive: boolean }) =>
    `flex items-center p-2 my-2 rounded ${isActive ? 'bg-gray-700 text-white' : 'text-gray-400 hover:bg-gray-700 hover:text-white'
    }`;

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleLogout = () => {
    signOut();
  }

  return (
    <div className="flex flex-col h-full">
      <button
        className="md:hidden text-black p-4"
        onClick={toggleSidebar}
      >
        <FaBars size={24} />
      </button>
      <div className={`w-full h-full bg-[#181818] text-white flex flex-col justify-between rounded-lg ${isSidebarOpen ? 'block' : 'hidden'} md:flex`}>      <div className="p-4">
        <div className="flex flex-col items-center">
          <img src={ProfileImage} alt="Profile" className="rounded-full w-20 h-20" />
          <h2 className="mt-4 text-xl font-semibold">Indica Watson</h2>
          <p className="text-gray-400">Real Estate Builders</p>
        </div>
        <nav className="mt-8">
          <NavLink to={DASHBOARD_ROUTE} className={navLinkClasses}>
            <FaTachometerAlt />
            <span className="ml-4">Dashboard</span>
          </NavLink>
          <NavLink to={PROPERTIES_ROUTE} className={navLinkClasses}>
            <FaChartBar />
            <span className="ml-4">Properties</span>
          </NavLink>
          <NavLink to={POSTS_ROUTE} className={navLinkClasses}>
            <FaChartBar />
            <span className="ml-4">Posts</span>
          </NavLink>
          <NavLink to={SETTINGS_ROUTE} className={navLinkClasses}>
            <FaCog />
            <span className="ml-4">Settings</span>
          </NavLink>
        </nav>
      </div>
        <div className="p-4">
          <NavLink
            to="/support"
            className="flex items-center p-2 my-2 text-gray-400 hover:bg-gray-700 hover:text-white rounded"
          >
            <FaQuestionCircle />
            <span className="ml-4">Help & Support</span>
          </NavLink>
          <NavLink
            onClick={handleLogout}
            to=""
            className="flex items-center p-2 my-2 text-red-500 hover:bg-red-700 hover:text-white rounded"
          >
            <FaSignOutAlt />
            <span className="ml-4">Log Out</span>
          </NavLink>
        </div>
      </div>
    </div>
  );
};
