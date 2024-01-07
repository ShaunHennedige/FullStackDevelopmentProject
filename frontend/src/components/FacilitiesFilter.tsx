// Importing the hotelFacilities array from the hotel-options-config file
import { hotelFacilities } from "../config/hotel-options-config";

// Defining the props for the FacilitiesFilter component
type Props = {
  selectedFacilities: string[];
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

// Functional component for filtering hotel facilities
const FacilitiesFilter = ({ selectedFacilities, onChange }: Props) => {
  return (
    // Container for the facilities filter with styling
    <div className="border-b border-slate-300 pb-5">
      {/* Title for the facilities filter section */}
      <h4 className="text-md font-semibold mb-2">Facilities</h4>

      {/* Mapping through the hotelFacilities array to display checkboxes */}
      {hotelFacilities.map((facility) => (
        // Label and checkbox for each facility
        <label className="flex items-center space-x-2">
          {/* Checkbox input for the facility with event handler */}
          <input
            type="checkbox"
            className="rounded"
            value={facility}
            checked={selectedFacilities.includes(facility)}
            onChange={onChange}
          />
          {/* Displaying the name of the facility next to the checkbox */}
          <span>{facility}</span>
        </label>
      ))}
    </div>
  );
};

// Exporting the FacilitiesFilter component as the default export
export default FacilitiesFilter;
