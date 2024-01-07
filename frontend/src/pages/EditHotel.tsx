// Importing necessary React and third-party libraries
import { useMutation, useQuery } from "react-query";
import { useParams } from "react-router-dom";
import * as apiClient from "../api-client";
import ManageHotelForm from "../forms/ManageHotelForm/ManageHotelForm";
import { useAppContext } from "../contexts/AppContext";

// Functional component for editing a hotel
const EditHotel = () => {
  // Retrieving hotelId from URL parameters
  const { hotelId } = useParams();

  // Accessing showToast function from AppContext
  const { showToast } = useAppContext();

  // Fetching hotel details using React Query
  const { data: hotel } = useQuery(
    "fetchMyHotelById",
    () => apiClient.fetchMyHotelById(hotelId || ""),
    {
      enabled: !!hotelId,
    }
  );

  // Using React Query mutation for updating hotel details
  const { mutate, isLoading } = useMutation(apiClient.updateMyHotelById, {
    onSuccess: () => {
      showToast({ message: "Hotel Saved!", type: "SUCCESS" });
    },
    onError: () => {
      showToast({ message: "Error Saving Hotel", type: "ERROR" });
    },
  });

  // Callback function to handle saving hotel data
  const handleSave = (hotelFormData: FormData) => {
    mutate(hotelFormData);
  };

  // Rendering the ManageHotelForm component with fetched hotel data
  return (
    <ManageHotelForm hotel={hotel} onSave={handleSave} isLoading={isLoading} />
  );
};

// Exporting the EditHotel component
export default EditHotel;
