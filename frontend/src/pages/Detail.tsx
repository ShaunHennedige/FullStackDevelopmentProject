// Importing necessary React and third-party libraries
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import * as apiClient from "./../api-client";
import { AiFillStar } from "react-icons/ai";
import GuestInfoForm from "../forms/GuestInfoForm/GuestInfoForm";

// Functional component for displaying hotel details
const Detail = () => {
  // Retrieving hotelId from URL parameters
  const { hotelId } = useParams();

  // Fetching hotel details using React Query
  const { data: hotel } = useQuery(
    "fetchHotelById",
    () => apiClient.fetchHotelById(hotelId || ""),
    {
      enabled: !!hotelId,
    }
  );

  // If hotel details are not available, return an empty fragment
  if (!hotel) {
    return <></>;
  }

  // Rendering hotel details, including star rating, name, images, facilities, description, and guest information form
  return (
    <div className="space-y-6">
      {/* Displaying star rating and hotel name */}
      <div>
        <span className="flex">
          {Array.from({ length: hotel.starRating }).map((_, index) => (
            <AiFillStar key={index} className="fill-yellow-400" />
          ))}
        </span>
        <h1 className="text-3xl font-bold">{hotel.name}</h1>
      </div>

      {/* Displaying hotel images in a grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {hotel.imageUrls.map((image, index) => (
          <div key={index} className="h-[300px]">
            <img
              src={image}
              alt={hotel.name}
              className="rounded-md w-full h-full object-cover object-center"
            />
          </div>
        ))}
      </div>

      {/* Displaying hotel facilities in a grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-2">
        {hotel.facilities.map((facility, index) => (
          <div key={index} className="border border-slate-300 rounded-sm p-3">
            {facility}
          </div>
        ))}
      </div>

      {/* Displaying hotel description and guest information form in a two-column grid */}
      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr]">
        <div className="whitespace-pre-line">{hotel.description}</div>
        <div className="h-fit">
          <GuestInfoForm
            pricePerNight={hotel.pricePerNight}
            hotelId={hotel._id}
          />
        </div>
      </div>
    </div>
  );
};

// Exporting the Detail component
export default Detail;
