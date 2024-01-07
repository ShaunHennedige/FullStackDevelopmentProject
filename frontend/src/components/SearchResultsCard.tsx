// Importing necessary React components and icons
import { Link } from "react-router-dom";
import { HotelType } from "../../../backend/src/shared/types";
import { AiFillStar } from "react-icons/ai";

// Defining the props for the SearchResultsCard component
type Props = {
  hotel: HotelType;
};

// Functional component for displaying a hotel search result card
const SearchResultsCard = ({ hotel }: Props) => {
  return (
    // Container for the search result card with grid layout and styling
    <div className="grid grid-cols-1 xl:grid-cols-[2fr_3fr] border border-slate-300 rounded-lg p-8 gap-8">
      {/* Image section with dynamic image from the hotel */}
      <div className="w-full h-[300px]">
        <img
          src={hotel.imageUrls[0]}
          className="w-full h-full object-cover object-center"
        />
      </div>

      {/* Hotel details section with various information */}
      <div className="grid grid-rows-[1fr_2fr_1fr]">
        {/* Rating, type, and hotel name */}
        <div>
          <div className="flex items-center">
            <span className="flex">
              {/* Displaying star rating using filled stars */}
              {Array.from({ length: hotel.starRating }).map((_, index) => (
                <AiFillStar key={index} className="fill-yellow-400" />
              ))}
            </span>
            {/* Displaying hotel type */}
            <span className="ml-1 text-sm">{hotel.type}</span>
          </div>
          {/* Link to the hotel detail page with hotel name */}
          <Link
            to={`/detail/${hotel._id}`}
            className="text-2xl font-bold cursor-pointer"
          >
            {hotel.name}
          </Link>
        </div>

        {/* Hotel description with line clamp to limit text lines */}
        <div>
          <div className="line-clamp-4">{hotel.description}</div>
        </div>

        {/* Facilities and price section */}
        <div className="grid grid-cols-2 items-end whitespace-nowrap">
          {/* Displaying up to 3 facilities with a "more" option if there are additional facilities */}
          <div className="flex gap-1 items-center">
            {hotel.facilities.slice(0, 3).map((facility, index) => (
              <span
                key={index}
                className="bg-slate-300 p-2 rounded-lg font-bold text-xs whitespace-nowrap"
              >
                {facility}
              </span>
            ))}
            <span className="text-sm">
              {hotel.facilities.length > 3 &&
                `+${hotel.facilities.length - 3} more`}
            </span>
          </div>

          {/* Price per night and "View More" link */}
          <div className="flex flex-col items-end gap-1">
            <span className="font-bold">£{hotel.pricePerNight} per night</span>
            <Link
              to={`/detail/${hotel._id}`}
              className="bg-violet-800  text-white h-full p-2 font-bold text-xl max-w-fit hover:bg-blue-500"
            >
              View More
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

// Exporting the SearchResultsCard component as the default export
export default SearchResultsCard;
