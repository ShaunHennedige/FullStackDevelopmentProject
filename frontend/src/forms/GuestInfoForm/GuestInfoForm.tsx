// Importing necessary React hooks and components
import { useForm } from "react-hook-form";
import DatePicker from "react-datepicker";
import { useSearchContext } from "../../contexts/SearchContext";
import { useAppContext } from "../../contexts/AppContext";
import { useLocation, useNavigate } from "react-router-dom";

// Type definition for component props
type Props = {
  hotelId: string;
  pricePerNight: number;
};

// Type definition for form data used in GuestInfoForm
type GuestInfoFormData = {
  checkIn: Date;
  checkOut: Date;
  adultCount: number;
  childCount: number;
};

// GuestInfoForm component
const GuestInfoForm = ({ hotelId, pricePerNight }: Props) => {
  // Accessing search context values, user login status, navigation functions, and location
  const search = useSearchContext();
  const { isLoggedIn } = useAppContext();
  const navigate = useNavigate();
  const location = useLocation();

  // React-hook-form functions for form handling
  const {
    watch,
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<GuestInfoFormData>({
    defaultValues: {
      checkIn: search.checkIn,
      checkOut: search.checkOut,
      adultCount: search.adultCount,
      childCount: search.childCount,
    },
  });

  // Watching checkIn and checkOut fields
  const checkIn = watch("checkIn");
  const checkOut = watch("checkOut");

  // Setting up min and max dates for date pickers
  const minDate = new Date();
  const maxDate = new Date();
  maxDate.setFullYear(maxDate.getFullYear() + 1);

  // Handling click on "Book Now" or "Sign in to Book" button
  const onSignInClick = (data: GuestInfoFormData) => {
    // Saving search values and navigating to sign-in page
    search.saveSearchValues("", data.checkIn, data.checkOut, data.adultCount, data.childCount);
    navigate("/sign-in", { state: { from: location } });
  };

  // Handling form submission
  const onSubmit = (data: GuestInfoFormData) => {
    // Saving search values and navigating to booking page
    search.saveSearchValues("", data.checkIn, data.checkOut, data.adultCount, data.childCount);
    navigate(`/hotel/${hotelId}/booking`);
  };

  // Rendering the GuestInfoForm
  return (
    <div className="flex flex-col p-4 bg-blue-200 gap-4">
      {/* Displaying the price per night */}
      <h3 className="text-md font-bold">£{pricePerNight}</h3>

      {/* Guest information form */}
      <form
        onSubmit={isLoggedIn ? handleSubmit(onSubmit) : handleSubmit(onSignInClick)}
      >
        {/* Form fields */}
        <div className="grid grid-cols-1 gap-4 items-center">
          <div>
            {/* Check-in date picker */}
            <DatePicker
              required
              selected={checkIn}
              onChange={(date) => setValue("checkIn", date as Date)}
              selectsStart
              startDate={checkIn}
              endDate={checkOut}
              minDate={minDate}
              maxDate={maxDate}
              placeholderText="Check-in Date"
              className="min-w-full bg-white p-2 focus:outline-none"
              wrapperClassName="min-w-full"
            />
          </div>
          <div>
            {/* Check-out date picker */}
            <DatePicker
              required
              selected={checkOut}
              onChange={(date) => setValue("checkOut", date as Date)}
              selectsStart
              startDate={checkIn}
              endDate={checkOut}
              minDate={minDate}
              maxDate={maxDate}
              placeholderText="Check-out Date"
              className="min-w-full bg-white p-2 focus:outline-none"
              wrapperClassName="min-w-full"
            />
          </div>
          <div className="flex bg-white px-2 py-1 gap-2">
            {/* Adults and Children input fields */}
            <label className="items-center flex">
              Adults:
              <input
                className="w-full p-1 focus:outline-none font-bold"
                type="number"
                min={1}
                max={20}
                {...register("adultCount", {
                  required: "This field is required",
                  min: {
                    value: 1,
                    message: "There must be at least one adult",
                  },
                  valueAsNumber: true,
                })}
              />
            </label>
            <label className="items-center flex">
              Children:
              <input
                className="w-full p-1 focus:outline-none font-bold"
                type="number"
                min={0}
                max={20}
                {...register("childCount", {
                  valueAsNumber: true,
                })}
              />
            </label>
            {errors.adultCount && (
              <span className="text-red-500 font-semibold text-sm">
                {errors.adultCount.message}
              </span>
            )}
          </div>

          {/* Conditional rendering of booking button based on login status */}
          {isLoggedIn ? (
            <button className="bg-violet-800 text-white h-full p-2 font-bold hover:bg-blue-500 text-xl">
              Book Now
            </button>
          ) : (
            <button className="bg-violet-800 text-white h-full p-2 font-bold hover:bg-blue-500 text-xl">
              Sign in to Book
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

// Exporting the GuestInfoForm component
export default GuestInfoForm;
