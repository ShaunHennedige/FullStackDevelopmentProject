// Importing necessary React and third-party libraries for form handling, state management, and routing
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "react-query";
import * as apiClient from "../api-client";
import { useAppContext } from "../contexts/AppContext";
import { Link, useLocation, useNavigate } from "react-router-dom";

// Defining the structure of the form data for sign-in
export type SignInFormData = {
  email: string;
  password: string;
};

// Functional component for the sign-in form
const SignIn = () => {
  // Accessing context and hooks for displaying toasts, navigation, and managing component state
  const { showToast } = useAppContext();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Extracting current location from the router
  const location = useLocation();

  // Form handling using react-hook-form library
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<SignInFormData>();

  // Using react-query for handling the sign-in mutation
  const mutation = useMutation(apiClient.signIn, {
    onSuccess: async () => {
      // Displaying a success toast on successful sign-in
      showToast({ message: "Sign in Successful!", type: "SUCCESS" });
      // Invalidating the token validation query and navigating to the previous page or home
      await queryClient.invalidateQueries("validateToken");
      navigate(location.state?.from?.pathname || "/");
    },
    onError: (error: Error) => {
      // Displaying an error toast on sign-in failure
      showToast({ message: error.message, type: "ERROR" });
    },
  });

  // Handling form submission
  const onSubmit = handleSubmit((data) => {
    // Calling the sign-in mutation with form data
    mutation.mutate(data);
  });

  // Rendering the sign-in form layout
  return (
    <form className="flex flex-col gap-5" onSubmit={onSubmit}>
      <h2 className="text-3xl font-bold">Sign In</h2>
      {/* Email input field */}
      <label className="text-gray-700 text-sm font-bold flex-1">
        Email
        <input
          type="email"
          className="border rounded w-full py-1 px-2 font-normal"
          {...register("email", { required: "This field is required" })}
        ></input>
        {errors.email && (
          <span className="text-red-500">{errors.email.message}</span>
        )}
      </label>
      {/* Password input field */}
      <label className="text-gray-700 text-sm font-bold flex-1">
        Password
        <input
          type="password"
          className="border rounded w-full py-1 px-2 font-normal"
          {...register("password", {
            required: "This field is required",
            minLength: {
              value: 6,
              message: "Password must be at least 6 characters",
            },
          })}
        ></input>
        {errors.password && (
          <span className="text-red-500">{errors.password.message}</span>
        )}
      </label>
      {/* Link to the registration page */}
      <span className="flex items-center justify-between">
        <span className="text-sm">
          Not Registered?{" "}
          <Link className="underline" to="/register">
            Create an account here
          </Link>
        </span>
        {/* Submit button for signing in */}
        <button
          type="submit"
          className="bg-violet-800  text-white p-2 font-bold hover:bg-blue-500 text-xl"
        >
          Login
        </button>
      </span>
    </form>
  );
};

// Exporting the SignIn component
export default SignIn;
