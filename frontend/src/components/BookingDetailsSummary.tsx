// Importing the HotelType from the shared types file
import { HotelType } from "../../../backend/src/shared/types";

// Defining the props for the BookingDetailsSummary component
type Props = {
  checkIn: Date;
  checkOut: Date;
  adultCount: number;
  childCount: number;
  numberOfNights: number;
  hotel: HotelType;
};

// Functional component for displaying booking details summary
const BookingDetailsSummary = ({
  checkIn,
  checkOut,
  adultCount,
  childCount,
  numberOfNights,
  hotel,
}: Props) => {
  return (
    // Container for the booking details with styling
    <div className="grid gap-4 rounded-lg border border-slate-300 p-5 h-fit">
      {/* Title for the booking details section */}
      <h2 className="text-xl font-bold">Your Booking Details</h2>

      {/* Location details with hotel name, city, and country */}
      <div className="border-b py-2">
        Location:
        <div className="font-bold">{`${hotel.name}, ${hotel.city}, ${hotel.country}`}</div>
      </div>

      {/* Check-in and Check-out details with formatted date */}
      <div className="flex justify-between">
        <div>
          Check-in
          <div className="font-bold"> {checkIn.toDateString()}</div>
        </div>
        <div>
          Check-out
          <div className="font-bold"> {checkOut.toDateString()}</div>
        </div>
      </div>

      {/* Total length of stay with the number of nights */}
      <div className="border-t border-b py-2">
        Total length of stay:
        <div className="font-bold">{numberOfNights} nights</div>
      </div>

      {/* Guests details with the count of adults and children */}
      <div>
        Guests{" "}
        <div className="font-bold">
          {adultCount} adults & {childCount} children
        </div>
      </div>
    </div>
  );
};

// Exporting the BookingDetailsSummary component as the default export
export default BookingDetailsSummary;
