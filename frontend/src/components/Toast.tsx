// Importing necessary React hooks
import { useEffect } from "react";

// Type definition for the props of the Toast component
type ToastProps = {
  message: string;
  type: "SUCCESS" | "ERROR";
  onClose: () => void;
};

// Functional component for displaying toast notifications
const Toast = ({ message, type, onClose }: ToastProps) => {
  // useEffect to automatically close the toast after a delay
  useEffect(() => {
    // Set a timer to close the toast after 5000 milliseconds (5 seconds)
    const timer = setTimeout(() => {
      onClose();
    }, 5000);

    // Cleanup function to clear the timer when the component is unmounted or updated
    return () => {
      clearTimeout(timer);
    };
  }, [onClose]); // Dependency array ensures the effect runs only when onClose changes

  // Dynamic styling based on the toast type (SUCCESS or ERROR)
  const styles =
    type === "SUCCESS"
      ? "fixed top-4 right-4 z-50 p-4 rounded-md bg-green-600 text-white max-w-md"
      : "fixed top-4 right-4 z-50 p-4 rounded-md bg-red-400 text-white max-w-md";

  // Rendering the toast with the specified styles and message
  return (
    <div className={styles}>
      <div className="flex justify-center items-center">
        {/* Displaying the message in a centered span */}
        <span className="text-lg font-semibold">{message}</span>
      </div>
    </div>
  );
};

// Exporting the Toast component as the default export
export default Toast;
