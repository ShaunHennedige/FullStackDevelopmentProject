// Importing necessary hooks and dependencies
import { useFormContext } from "react-hook-form";
import { HotelFormData } from "./ManageHotelForm";

// ImagesSection component
const ImagesSection = () => {
  // Accessing form context using useFormContext hook
  const {
    register,
    formState: { errors },
    watch,
    setValue,
  } = useFormContext<HotelFormData>();

  // Getting existing image URLs from the form data
  const existingImageUrls = watch("imageUrls");

  // Function to handle deletion of an image URL
  const handleDelete = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    imageUrl: string
  ) => {
    event.preventDefault();
    // Removing the selected image URL from the form data
    setValue(
      "imageUrls",
      existingImageUrls.filter((url) => url !== imageUrl)
    );
  };

  // Rendering the ImagesSection component
  return (
    <div>
      {/* Section title */}
      <h2 className="text-2xl font-bold mb-3">Images</h2>

      {/* Container for displaying existing image URLs and file input */}
      <div className="border rounded p-4 flex flex-col gap-4">
        {/* Displaying existing image URLs as thumbnails */}
        {existingImageUrls && (
          <div className="grid grid-cols-6 gap-4">
            {existingImageUrls.map((url) => (
              <div className="relative group" key={url}>
                <img src={url} className="min-h-full object-cover" />
                {/* Delete button for each image URL */}
                <button
                  onClick={(event) => handleDelete(event, url)}
                  className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 text-white"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}

        {/* File input for adding new images */}
        <input
          type="file"
          multiple
          accept="image/*"
          className="w-full text-gray-700 font-normal"
          {...register("imageFiles", {
            // Validation for image files
            validate: (imageFiles) => {
              const totalLength =
                imageFiles.length + (existingImageUrls?.length || 0);

              if (totalLength === 0) {
                return "At least one image should be added";
              }

              if (totalLength > 6) {
                return "Total number of images cannot be more than 6";
              }

              return true;
            },
          })}
        />
      </div>

      {/* Displaying error message if there are validation errors for image files */}
      {errors.imageFiles && (
        <span className="text-red-500 text-sm font-bold">
          {errors.imageFiles.message}
        </span>
      )}
    </div>
  );
};

// Exporting the ImagesSection component
export default ImagesSection;
