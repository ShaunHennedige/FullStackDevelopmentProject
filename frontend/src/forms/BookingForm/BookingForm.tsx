// Importing necessary React hooks, components, and types
import { useForm } from "react-hook-form";
import {
  PaymentIntentResponse,
  UserType,
} from "../../../../backend/src/shared/types";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { StripeCardElement } from "@stripe/stripe-js";
import { useSearchContext } from "../../contexts/SearchContext";
import { useParams } from "react-router-dom";
import { useMutation } from "react-query";
import * as apiClient from "../../api-client";
import { useAppContext } from "../../contexts/AppContext";

// Type definition for the component props
type Props = {
  currentUser: UserType;
  paymentIntent: PaymentIntentResponse;
};

// Type definition for the form data used in the BookingForm
export type BookingFormData = {
  firstName: string;
  lastName: string;
  email: string;
  adultCount: number;
  childCount: number;
  checkIn: string;
  checkOut: string;
  hotelId: string;
  paymentIntentId: string;
  totalCost: number;
};

// BookingForm component
const BookingForm = ({ currentUser, paymentIntent }: Props) => {
  // Stripe elements and stripe instance
  const stripe = useStripe();
  const elements = useElements();

  // Accessing search context values and hotelId from URL params
  const search = useSearchContext();
  const { hotelId } = useParams();

  // Accessing showToast function from AppContext
  const { showToast } = useAppContext();

  // React-query mutation for creating a room booking
  const { mutate: bookRoom, isLoading } = useMutation(
    apiClient.createRoomBooking,
    {
      onSuccess: () => {
        showToast({ message: "Booking Saved!", type: "SUCCESS" });
      },
      onError: () => {
        showToast({ message: "Error saving booking", type: "ERROR" });
      },
    }
  );

  // React-hook-form functions for form handling
  const { handleSubmit, register } = useForm<BookingFormData>({
    defaultValues: {
      firstName: currentUser.firstName,
      lastName: currentUser.lastName,
      email: currentUser.email,
      adultCount: search.adultCount,
      childCount: search.childCount,
      checkIn: search.checkIn.toISOString(),
      checkOut: search.checkOut.toISOString(),
      hotelId: hotelId,
      totalCost: paymentIntent.totalCost,
      paymentIntentId: paymentIntent.paymentIntentId,
    },
  });

  // Form submission handler
  const onSubmit = async (formData: BookingFormData) => {
    // Checking for Stripe and Elements availability
    if (!stripe || !elements) {
      return;
    }

    // Confirming card payment with Stripe
    const result = await stripe.confirmCardPayment(paymentIntent.clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement) as StripeCardElement,
      },
    });

    // Handling the result of the payment confirmation
    if (result.paymentIntent?.status === "succeeded") {
      // Invoking the bookRoom mutation with the form data and updated paymentIntentId
      bookRoom({ ...formData, paymentIntentId: result.paymentIntent.id });
    }
  };

  // Rendering the booking form
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="grid grid-cols-1 gap-5 rounded-lg border border-slate-300 p-5"
    >
      <span className="text-3xl font-bold">Confirm Your Details</span>
      {/* User information section */}
      <div className="grid grid-cols-2 gap-6">
        {/* First Name input */}
        <label className="text-gray-700 text-sm font-bold flex-1">
          First Name
          <input
            className="mt-1 border rounded w-full py-2 px-3 text-gray-700 bg-gray-200 font-normal"
            type="text"
            readOnly
            disabled
            {...register("firstName")}
          />
        </label>
        {/* Last Name input */}
        <label className="text-gray-700 text-sm font-bold flex-1">
          Last Name
          <input
            className="mt-1 border rounded w-full py-2 px-3 text-gray-700 bg-gray-200 font-normal"
            type="text"
            readOnly
            disabled
            {...register("lastName")}
          />
        </label>
        {/* Email input */}
        <label className="text-gray-700 text-sm font-bold flex-1">
          Email
          <input
            className="mt-1 border rounded w-full py-2 px-3 text-gray-700 bg-gray-200 font-normal"
            type="text"
            readOnly
            disabled
            {...register("email")}
          />
        </label>
      </div>

      {/* Price summary section */}
      <div className="space-y-2">
        <h2 className="text-xl font-semibold">Your Price Summary</h2>
        {/* Total cost display */}
        <div className="bg-blue-200 p-4 rounded-md">
          <div className="font-semibold text-lg">
            Total Cost: £{paymentIntent.totalCost.toFixed(2)}
          </div>
          <div className="text-xs">Includes taxes and charges</div>
        </div>
      </div>

      {/* Payment details section */}
      <div className="space-y-2">
        <h3 className="text-xl font-semibold"> Payment Details</h3>
        {/* Stripe CardElement */}
        <CardElement
          id="payment-element"
          className="border rounded-md p-2 text-sm"
        />
      </div>

      {/* Submission button */}
      <div className="flex justify-end">
        <button
          disabled={isLoading}
          type="submit"
          className="bg-violet-800  text-white p-2 font-bold hover:bg-blue-500 text-md disabled:bg-gray-500"
        >
          {isLoading ? "Saving..." : "Confirm Booking"}
        </button>
      </div>
    </form>
  );
};

// Exporting the BookingForm component
export default BookingForm;
