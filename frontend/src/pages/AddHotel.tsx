// Importing necessary React and third-party libraries
import { useMutation } from "react-query";
import ManageHotelForm from "../forms/ManageHotelForm/ManageHotelForm";
import { useAppContext } from "../contexts/AppContext";
import * as apiClient from "../api-client";

// Functional component for adding a hotel
const AddHotel = () => {
  // Accessing showToast function from AppContext
  const { showToast } = useAppContext();

  // Defining a mutation using useMutation hook to add a hotel
  const { mutate, isLoading } = useMutation(apiClient.addMyHotel, {
    // Handling successful hotel addition
    onSuccess: () => {
      showToast({ message: "Hotel Saved!", type: "SUCCESS" });
    },
    // Handling error during hotel addition
    onError: () => {
      showToast({ message: "Error Saving Hotel", type: "ERROR" });
    },
  });

  // Handling save action for the ManageHotelForm
  const handleSave = (hotelFormData: FormData) => {
    // Initiating the mutation to add the hotel
    mutate(hotelFormData);
  };

  // Rendering the ManageHotelForm with the handleSave function
  return <ManageHotelForm onSave={handleSave} isLoading={isLoading} />;
};

// Exporting the AddHotel component
export default AddHotel;
