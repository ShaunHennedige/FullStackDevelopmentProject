// Defining the props for the StarRatingFilter component
type Props = {
  selectedStars: string[];
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

// Functional component for filtering star ratings
const StarRatingFilter = ({ selectedStars, onChange }: Props) => {
  return (
    // Container for the star rating filter with border and padding
    <div className="border-b border-slate-300 pb-5">
      {/* Title for the star rating filter section */}
      <h4 className="text-md font-semibold mb-2">Property Rating</h4>

      {/* Mapping through star ratings and creating checkboxes */}
      {["5", "4", "3", "2", "1"].map((star) => (
        // Label and checkbox for each star rating
        <label className="flex items-center space-x-2">
          {/* Checkbox input for the star rating with event handler */}
          <input
            type="checkbox"
            className="rounded"
            value={star}
            checked={selectedStars.includes(star)}
            onChange={onChange}
          />
          {/* Displaying the star rating value and the word "Stars" */}
          <span>{star} Stars</span>
        </label>
      ))}
    </div>
  );
};

// Exporting the StarRatingFilter component as the default export
export default StarRatingFilter;
