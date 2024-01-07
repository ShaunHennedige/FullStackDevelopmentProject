// Importing React Query for data fetching, React Router Link, and necessary icons
import { useQuery } from "react-query";
import { Link } from "react-router-dom";
import * as apiClient from "../api-client";
import { BsBuilding, BsMap } from "react-icons/bs";
import { BiHotel, BiMoney, BiStar } from "react-icons/bi";

// Functional component for displaying user's hotels
const MyHotels = () => {
  // Fetching user's hotel data using React Query
  const { data: hotelData } = useQuery("fetchMyHotels", apiClient.fetchMyHotels, {
    onError: () => {},
  });

  // Rendering UI based on the fetched data
  if (!hotelData) {
    return <span>No Hotels found</span>;
  }

  // Displaying a list of user's hotels with details
  return (
    <div className="space-y-5">
      {/* Header with "My Hotels" title and "Add Hotel" link */}
      <span className="flex justify-between">
        <h1 className="text-3xl font-bold">My Hotels</h1>
        <Link
          to="/add-hotel"
          className="flex bg-violet-800 text-white text-xl font-bold p-2 hover:bg-blue-500"
        >
          Add Hotel
        </Link>
      </span>

      {/* Grid layout for displaying individual hotel cards */}
      <div className="grid grid-cols-1 gap-8">
        {/* Mapping over user's hotels and rendering hotel cards */}
        {hotelData.map((hotel) => (
          <div
            data-testid="hotel-card"
            className="flex flex-col justify-between border border-slate-300 rounded-lg p-8 gap-5"
            key={hotel._id}
          >
            {/* Hotel name and description */}
            <h2 className="text-2xl font-bold">{hotel.name}</h2>
            <div className="whitespace-pre-line">{hotel.description}</div>

            {/* Grid layout for displaying hotel details */}
            <div className="grid grid-cols-5 gap-2">
              {/* Hotel location */}
              <div className="border border-slate-300 rounded-sm p-3 flex items-center">
                <BsMap className="mr-1" />
                {hotel.city}, {hotel.country}
              </div>

              {/* Hotel type */}
              <div className="border border-slate-300 rounded-sm p-3 flex items-center">
                <BsBuilding className="mr-1" />
                {hotel.type}
              </div>

              {/* Price per night */}
              <div className="border border-slate-300 rounded-sm p-3 flex items-center">
                <BiMoney className="mr-1" />£{hotel.pricePerNight} per night
              </div>

              {/* Guest count */}
              <div className="border border-slate-300 rounded-sm p-3 flex items-center">
                <BiHotel className="mr-1" />
                {hotel.adultCount} adults, {hotel.childCount} children
              </div>

              {/* Star rating */}
              <div className="border border-slate-300 rounded-sm p-3 flex items-center">
                <BiStar className="mr-1" />
                {hotel.starRating} Star Rating
              </div>
            </div>

            {/* "View Details" link */}
            <span className="flex justify-end">
              <Link
                to={`/edit-hotel/${hotel._id}`}
                className="flex bg-violet-800 text-white text-xl font-bold p-2 hover:bg-blue-500"
              >
                View Details
              </Link>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

// Exporting the MyHotels component
export default MyHotels;
