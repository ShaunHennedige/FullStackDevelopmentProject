// Importing React Query for data fetching and API client functions
import { useQuery } from "react-query";
import * as apiClient from "../api-client";

// Functional component for displaying user's bookings
const MyBookings = () => {
  // Fetching user's bookings using React Query
  const { data: hotels } = useQuery("fetchMyBookings", apiClient.fetchMyBookings);

  // Rendering UI based on the fetched data
  if (!hotels || hotels.length === 0) {
    return <span>No bookings found</span>;
  }

  // Displaying a list of user's bookings
  return (
    <div className="space-y-5">
      <h1 className="text-3xl font-bold">My Bookings</h1>

      {/* Mapping over user's hotels and rendering booking details */}
      {hotels.map((hotel) => (
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_3fr] border border-slate-300 rounded-lg p-8 gap-5">
          {/* Displaying the first image of the hotel */}
          <div className="lg:w-full lg:h-[250px]">
            <img
              src={hotel.imageUrls[0]}
              className="w-full h-full object-cover object-center"
              alt={hotel.name}
            />
          </div>

          {/* Displaying hotel and booking details */}
          <div className="flex flex-col gap-4 overflow-y-auto max-h-[300px]">
            <div className="text-2xl font-bold">
              {hotel.name}
              <div className="text-xs font-normal">
                {hotel.city}, {hotel.country}
              </div>
            </div>

            {/* Mapping over bookings for the current hotel */}
            {hotel.bookings.map((booking) => (
              <div key={booking._id}>
                <div>
                  <span className="font-bold mr-2">Dates: </span>
                  <span>
                    {new Date(booking.checkIn).toDateString()} -
                    {new Date(booking.checkOut).toDateString()}
                  </span>
                </div>
                <div>
                  <span className="font-bold mr-2">Guests:</span>
                  <span>
                    {booking.adultCount} adults, {booking.childCount} children
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

// Exporting the MyBookings component
export default MyBookings;
