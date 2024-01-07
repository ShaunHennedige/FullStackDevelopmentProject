// Importing necessary React and third-party libraries
import { useQuery } from "react-query";
import * as apiClient from "../api-client";
import BookingForm from "../forms/BookingForm/BookingForm";
import { useSearchContext } from "../contexts/SearchContext";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import BookingDetailsSummary from "../components/BookingDetailsSummary";
import { Elements } from "@stripe/react-stripe-js";
import { useAppContext } from "../contexts/AppContext";

// Functional component for handling the booking process
const Booking = () => {
  // Accessing stripePromise and showToast function from AppContext
  const { stripePromise } = useAppContext();
  // Accessing search context to retrieve search details
  const search = useSearchContext();
  // Retrieving hotelId from URL parameters
  const { hotelId } = useParams();

  // State to store the calculated number of nights for booking
  const [numberOfNights, setNumberOfNights] = useState<number>(0);

  // Calculating the number of nights when check-in and check-out dates change
  useEffect(() => {
    if (search.checkIn && search.checkOut) {
      const nights =
        Math.abs(search.checkOut.getTime() - search.checkIn.getTime()) /
        (1000 * 60 * 60 * 24);

      setNumberOfNights(Math.ceil(nights));
    }
  }, [search.checkIn, search.checkOut]);

  // Fetching payment intent data based on hotelId and numberOfNights
  const { data: paymentIntentData } = useQuery(
    "createPaymentIntent",
    () =>
      apiClient.createPaymentIntent(
        hotelId as string,
        numberOfNights.toString()
      ),
    {
      enabled: !!hotelId && numberOfNights > 0,
    }
  );

  // Fetching hotel details based on hotelId
  const { data: hotel } = useQuery(
    "fetchHotelByID",
    () => apiClient.fetchHotelById(hotelId as string),
    {
      enabled: !!hotelId,
    }
  );

  // Fetching current user data
  const { data: currentUser } = useQuery(
    "fetchCurrentUser",
    apiClient.fetchCurrentUser
  );

  // If hotel details are not available, return an empty fragment
  if (!hotel) {
    return <></>;
  }

  // Rendering the booking details summary and booking form components
  return (
    <div className="grid md:grid-cols-[1fr_2fr]">
      <BookingDetailsSummary
        checkIn={search.checkIn}
        checkOut={search.checkOut}
        adultCount={search.adultCount}
        childCount={search.childCount}
        numberOfNights={numberOfNights}
        hotel={hotel}
      />
      {/* Rendering BookingForm component within Stripe Elements */}
      {currentUser && paymentIntentData && (
        <Elements
          stripe={stripePromise}
          options={{
            clientSecret: paymentIntentData.clientSecret,
          }}
        >
          <BookingForm
            currentUser={currentUser}
            paymentIntent={paymentIntentData}
          />
        </Elements>
      )}
    </div>
  );
};

// Exporting the Booking component
export default Booking;
