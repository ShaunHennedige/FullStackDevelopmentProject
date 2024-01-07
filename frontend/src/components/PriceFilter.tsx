// Defining the props for the PriceFilter component
type Props = {
  selectedPrice?: number;
  onChange: (value?: number) => void;
};

// Functional component for filtering prices
const PriceFilter = ({ selectedPrice, onChange }: Props) => {
  return (
    // Container for the price filter with styling
    <div>
      {/* Title for the price filter section */}
      <h4 className="text-md font-semibold mb-2"> Max Price</h4>

      {/* Dropdown menu for selecting the maximum price */}
      <select
        className="p-2 border rounded-md w-full"
        value={selectedPrice}
        onChange={(event) =>
          // Triggering the onChange callback with the selected price value
          onChange(
            event.target.value ? parseInt(event.target.value) : undefined
          )
        }
      >
        {/* Default option for selecting max price */}
        <option value="">Select Max Price</option>

        {/* Mapping through predefined price options and creating dropdown options */}
        {[50, 100, 200, 300, 500].map((price) => (
          <option key={price} value={price}>
            {price}
          </option>
        ))}
      </select>
    </div>
  );
};

// Exporting the PriceFilter component as the default export
export default PriceFilter;
