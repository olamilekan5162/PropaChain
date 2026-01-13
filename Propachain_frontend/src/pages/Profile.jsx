import { User, Mail, Phone, MapPin, Edit } from "lucide-react";

export default function Profile() {
  const userProfile = {
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+234 801 234 5678",
    location: "Lagos, Nigeria",
    joinedDate: "January 2024",
    totalListings: 3,
    verified: true,
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-16 md:pb-8">
      <div className="bg-white border-b border-gray-200 px-3 md:px-4 py-3 md:py-4 mb-4 md:mb-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-xl md:text-2xl font-bold text-gray-900">
            My Profile
          </h1>
          <p className="text-sm md:text-base text-gray-600 mt-1">
            Manage your account information
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-3 md:px-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4 md:p-6 mb-4 md:mb-6">
          <div className="flex items-center gap-3 md:gap-4 mb-4 md:mb-6 pb-4 md:pb-6 border-b border-gray-200">
            <div className="w-16 md:w-20 h-16 md:h-20 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-teal-700 font-bold text-xl md:text-2xl">
                {userProfile.name.charAt(0)}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-lg md:text-xl font-bold text-gray-900 truncate">
                  {userProfile.name}
                </h2>
                {userProfile.verified && (
                  <svg
                    className="w-4 md:w-5 h-4 md:h-5 text-blue-500 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </div>
              <p className="text-sm md:text-base text-gray-600">
                Member since {userProfile.joinedDate}
              </p>
            </div>
            <button className="px-3 md:px-4 py-1.5 md:py-2 text-sm md:text-base border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-1.5 md:gap-2 flex-shrink-0">
              <Edit className="w-3.5 md:w-4 h-3.5 md:h-4" />
              <span className="hidden sm:inline">Edit Profile</span>
              <span className="sm:hidden">Edit</span>
            </button>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-gray-600" />
              <div>
                <div className="text-sm text-gray-600">Email</div>
                <div className="font-medium text-gray-900">
                  {userProfile.email}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-gray-600" />
              <div>
                <div className="text-sm text-gray-600">Phone</div>
                <div className="font-medium text-gray-900">
                  {userProfile.phone}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-gray-600" />
              <div>
                <div className="text-sm text-gray-600">Location</div>
                <div className="font-medium text-gray-900">
                  {userProfile.location}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 md:p-6">
          <h3 className="text-base md:text-lg font-bold text-gray-900 mb-3 md:mb-4">
            Statistics
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
            <div>
              <div className="text-xl md:text-2xl font-bold text-gray-900">
                {userProfile.totalListings}
              </div>
              <div className="text-xs md:text-sm text-gray-600">
                Active Listings
              </div>
            </div>
            <div>
              <div className="text-xl md:text-2xl font-bold text-gray-900">
                0
              </div>
              <div className="text-xs md:text-sm text-gray-600">
                Sold Properties
              </div>
            </div>
            <div>
              <div className="text-xl md:text-2xl font-bold text-gray-900">
                4.8
              </div>
              <div className="text-xs md:text-sm text-gray-600">Rating</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
