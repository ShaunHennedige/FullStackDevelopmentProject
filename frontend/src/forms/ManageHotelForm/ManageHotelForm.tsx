// Importing necessary hooks and dependencies
import { FormProvider, useForm } from "react-hook-form";
import DetailsSection from "./DetailsSection";
import TypeSection from "./TypeSection";
import FacilitiesSection from "./FacilitiesSection";
import GuestsSection from "./GuestsSection";
import ImagesSection from "./ImagesSection";
import { HotelType } from "../../../../backend/src/shared/types";
import { useEffect } from "react";

// Defining the shape of the form data
export type HotelFormData = {
  name: string;
  city: string;
  country: string;
  description: string;
  type: string;
  pricePerNight: number;
  starRating: number;
  facilities: string[];
  imageFiles: FileList;
  imageUrls: string[];
  adultCount: number;
  childCount: number;
};

// Props for the ManageHotelForm component
type Props = {
  hotel?: HotelType;
  onSave: (hotelFormData: FormData) => void;
  isLoading: boolean;
};

// ManageHotelForm component
const ManageHotelForm = ({ onSave, isLoading, hotel }: Props) => {
  // Creating form methods using useForm hook
  const formMethods = useForm<HotelFormData>();
  const { handleSubmit, reset } = formMethods;

  // Resetting the form when hotel data changes
  useEffect(() => {
    reset(hotel);
  }, [hotel, reset]);

  // Handling form submission
  const onSubmit = handleSubmit((formDataJson: HotelFormData) => {
    // Creating a FormData object to handle multipart/form-data
    const formData = new FormData();

    // Appending form data to the FormData object
    if (hotel) {
      formData.append("hotelId", hotel._id);
    }
    formData.append("name", formDataJson.name);
    formData.append("city", formDataJson.city);
    formData.append("country", formDataJson.country);
    formData.append("description", formDataJson.description);
    formData.append("type", formDataJson.type);
    formData.append("pricePerNight", formDataJson.pricePerNight.toString());
    formData.append("starRating", formDataJson.starRating.toString());
    formData.append("adultCount", formDataJson.adultCount.toString());
    formData.append("childCount", formDataJson.childCount.toString());

    // Appending facilities to the FormData object
    formDataJson.facilities.forEach((facility, index) => {
      formData.append(`facilities[${index}]`, facility);
    });

    // Appending image URLs to the FormData object
    if (formDataJson.imageUrls) {
      formDataJson.imageUrls.forEach((url, index) => {
        formData.append(`imageUrls[${index}]`, url);
      });
    }

    // Appending image files to the FormData object
    Array.from(formDataJson.imageFiles).forEach((imageFile) => {
      formData.append(`imageFiles`, imageFile);
    });

    // Calling the onSave callback with the FormData object
    onSave(formData);
  });

  // Rendering the ManageHotelForm component
  return (
    <FormProvider {...formMethods}>
      <form className="flex flex-col gap-10" onSubmit={onSubmit}>
        {/* Sections for different parts of hotel information */}
        <DetailsSection />
        <TypeSection />
        <FacilitiesSection />
        <GuestsSection />
        <ImagesSection />

        {/* Save button */}
        <span className="flex justify-end">
          <button
            disabled={isLoading}
            type="submit"
            className="bg-violet-800  text-white p-2 font-bold hover:bg-blue-500 text-xl disabled:bg-gray-500"
          >
            {isLoading ? "Saving..." : "Save"}
          </button>
        </span>
      </form>
    </FormProvider>
  );
};

// Exporting the ManageHotelForm component
export default ManageHotelForm;
