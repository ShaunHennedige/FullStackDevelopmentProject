// Importing hotelTypes array from the hotel-options-config file
import { hotelTypes } from "../config/hotel-options-config";

// Type definition for the props of the HotelTypesFilter component
type Props = {
  selectedHotelTypes: string[];
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

// Functional component for filtering hotel types
const HotelTypesFilter = ({ selectedHotelTypes, onChange }: Props) => {
  return (
    // Container for the hotel types filter with border and padding
    <div className="border-b border-slate-300 pb-5">
      {/* Title for the hotel types filter section */}
      <h4 className="text-md font-semibold mb-2">Hotel Type</h4>

      {/* Mapping through hotelTypes array and creating checkboxes */}
      {hotelTypes.map((hotelType) => (
        // Label and checkbox for each hotel type
        <label className="flex items-center space-x-2">
          {/* Checkbox input for the hotel type with event handler */}
          <input
            type="checkbox"
            className="rounded"
            value={hotelType}
            checked={selectedHotelTypes.includes(hotelType)}
            onChange={onChange}
          />
          {/* Displaying the name of the hotel type next to the checkbox */}
          <span>{hotelType}</span>
        </label>
      ))}
    </div>
  );
};

// Exporting the HotelTypesFilter component as the default export
export default HotelTypesFilter;
