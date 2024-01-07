// Importing necessary hooks and dependencies
import { useFormContext } from "react-hook-form";
import { hotelFacilities } from "../../config/hotel-options-config";
import { HotelFormData } from "./ManageHotelForm";

// FacilitiesSection component
const FacilitiesSection = () => {
  // Accessing form context using useFormContext hook
  const {
    register,
    formState: { errors },
  } = useFormContext<HotelFormData>();

  // Rendering the FacilitiesSection component
  return (
    <div>
      {/* Section title */}
      <h2 className="text-2xl font-bold mb-3">Facilities</h2>

      {/* Facilities checkboxes */}
      <div className="grid grid-cols-5 gap-3">
        {hotelFacilities.map((facility) => (
          <label className="text-sm flex gap-1 text-gray-700">
            {/* Checkbox input for each facility */}
            <input
              type="checkbox"
              value={facility}
              {...register("facilities", {
                // Validation logic to ensure at least one facility is selected
                validate: (facilities) => {
                  if (facilities && facilities.length > 0) {
                    return true;
                  } else {
                    return "At least one facility is required";
                  }
                },
              })}
            />
            {/* Facility label */}
            {facility}
          </label>
        ))}
      </div>

      {/* Error message for facilities validation */}
      {errors.facilities && (
        <span className="text-red-500 text-sm font-bold">
          {errors.facilities.message}
        </span>
      )}
    </div>
  );
};

// Exporting the FacilitiesSection component
export default FacilitiesSection;
