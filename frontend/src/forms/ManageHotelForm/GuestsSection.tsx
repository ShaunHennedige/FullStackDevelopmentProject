// Importing necessary hooks and dependencies
import { useFormContext } from "react-hook-form";
import { HotelFormData } from "./ManageHotelForm";

// GuestsSection component
const GuestsSection = () => {
  // Accessing form context using useFormContext hook
  const {
    register,
    formState: { errors },
  } = useFormContext<HotelFormData>();

  // Rendering the GuestsSection component
  return (
    <div>
      {/* Section title */}
      <h2 className="text-2xl font-bold mb-3">Guests</h2>

      {/* Grid layout for Adults and Children input fields */}
      <div className="grid grid-cols-2 p-6 gap-5 bg-gray-300">
        {/* Adults input field */}
        <label className="text-gray-700 text-sm font-semibold">
          Adults
          <input
            className="border rounded w-full py-2 px-3 font-normal"
            type="number"
            min={1}
            {...register("adultCount", {
              required: "This field is required",
            })}
          />
          {/* Error message for Adults input field */}
          {errors.adultCount?.message && (
            <span className="text-red-500 text-sm font-bold">
              {errors.adultCount?.message}
            </span>
          )}
        </label>

        {/* Children input field */}
        <label className="text-gray-700 text-sm font-semibold">
          Children
          <input
            className="border rounded w-full py-2 px-3 font-normal"
            type="number"
            min={0}
            {...register("childCount", {
              required: "This field is required",
            })}
          />
          {/* Error message for Children input field */}
          {errors.childCount?.message && (
            <span className="text-red-500 text-sm font-bold">
              {errors.childCount?.message}
            </span>
          )}
        </label>
      </div>
    </div>
  );
};

// Exporting the GuestsSection component
export default GuestsSection;
