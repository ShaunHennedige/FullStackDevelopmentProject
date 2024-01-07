// Importing necessary React and third-party libraries
import { useQuery } from "react-query";
import * as apiClient from "../api-client";
import LatestDestinationCard from "../components/LastestDestinationCard";

// Functional component for the home page
const Home = () => {
  // Fetching hotel data using React Query
  const { data: hotels } = useQuery("fetchQuery", () =>
    apiClient.fetchHotels()
  );

  // Separating the fetched hotels into two rows for display
  const topRowHotels = hotels?.slice(0, 2) || [];
  const bottomRowHotels = hotels?.slice(2) || [];

  // Rendering the home page content with latest destinations
  return (
    <div className="space-y-3">
      <h2 className="text-3xl font-bold">Latest Destinations</h2>
      <p>Most recent destinations added by our hosts</p>

      {/* Displaying the latest destinations in a grid layout */}
      <div className="grid gap-4">
        <div className="grid md:grid-cols-2 grid-cols-1 gap-4">
          {/* Mapping over top row hotels and rendering LatestDestinationCard component */}
          {topRowHotels.map((hotel) => (
            <LatestDestinationCard key={hotel._id} hotel={hotel} />
          ))}
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          {/* Mapping over bottom row hotels and rendering LatestDestinationCard component */}
          {bottomRowHotels.map((hotel) => (
            <LatestDestinationCard key={hotel._id} hotel={hotel} />
          ))}
        </div>
      </div>
    </div>
  );
};

// Exporting the Home component
export default Home;
