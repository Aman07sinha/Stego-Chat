import React, { useState, useEffect, useRef } from "react";
import { Menu, Search, LogOut } from "lucide-react";
import { useDispatch } from "react-redux";
import { userLogout } from "../../../redux/slices/authSlice";
import api from "../../../services/api";
import UserProfileSummary from "../../profile/UserProfileSummary";
import FriendRequests from "../../notifications/FriendRequests";
import Notifications from "../../notifications/Notifications";

const Topbar = ({ toggleSidebar }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const searchRef = useRef(null);
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(userLogout());
  };

  const handleSearch = async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      setIsDropdownOpen(false);
      return;
    }

    try {
      const response = await api.get(`/users/search?query=${query}`);
      setSearchResults(response.data);
      setIsDropdownOpen(true);
    } catch (error) {
      setSearchResults([]);
      setIsDropdownOpen(true);
    }
  };

  const closeProfileSummary = () => {
    setSelectedUser(null);
  };

  const handleInputChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    handleSearch(query);
  };

  const handleClickOutside = (e) => {
    if (searchRef.current && !searchRef.current.contains(e.target)) {
      setIsDropdownOpen(false);
      setSearchQuery("");
    }
  };

  const handleUserClick = (username) => {
    setIsDropdownOpen(false);
    setSearchQuery("");
    setSelectedUser(username);
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <>
      <header className="bg-blue-200 fixed top-0 left-0 w-full z-50 h-14 shadow-md">
        <div className="max-w-screen-2xl mx-auto h-full px-4 flex items-center justify-between">

          {/* LEFT: Menu + Logo */}
          <div className="flex items-center space-x-3 w-1/4 min-w-[200px]">
            <button onClick={toggleSidebar} className="transition-transform active:scale-90">
              <Menu size={24} className="text-gray-700" />
            </button>
            <h1 className="text-xl font-semibold text-gray-900">StegoChat</h1>
          </div>

          {/* CENTER: Search Bar */}
          <div ref={searchRef} className="relative w-1/2 max-w-xl">
            <input
              type="text"
              placeholder="Search Friends..."
              value={searchQuery}
              onChange={handleInputChange}
              className="w-full px-4 py-2 pr-10 rounded-full border border-gray-400 bg-blue-100 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
            <button className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <Search className="text-gray-700" size={18} />
            </button>

            {/* Dropdown */}
            {isDropdownOpen && (
              <div className="absolute top-full left-0 w-full bg-white border border-gray-300 rounded-b-md shadow-md z-10">
                {searchResults.length > 0 ? (
                  searchResults.map((user) => (
                    <div
                      key={user.username}
                      onClick={() => handleUserClick(user.username)}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    >
                      {user.username}
                    </div>
                  ))
                ) : (
                  <div className="px-4 py-2 text-gray-500">User not found</div>
                )}
              </div>
            )}
          </div>

          {/* RIGHT: Icons */}
          <div className="flex items-center space-x-6 justify-end w-1/4 min-w-[220px]">
            <div className="flex items-center justify-center">
              <FriendRequests />
            </div>
            <div className="flex items-center justify-center">
              <Notifications />
            </div>

            <img
              src="https://via.placeholder.com/40"
              alt="Profile"
              className="w-10 h-10 rounded-full cursor-pointer transition-transform transform hover:scale-105"
            />
            <button
              onClick={handleLogout}
              className="flex items-center text-red-600 hover:text-red-700 text-sm font-medium transition-colors"
            >
              <LogOut size={20} className="mr-1" />
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* User Profile Modal */}
      {selectedUser && (
        <UserProfileSummary
          username={selectedUser}
          onClose={closeProfileSummary}
        />
      )}
    </>
  );
};

export default Topbar;
