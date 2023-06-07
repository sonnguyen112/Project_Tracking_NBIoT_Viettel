import { useLoadScript } from "@react-google-maps/api";
import Map from "./Map";
import "./styles.css";

export default function App() {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: "AIzaSyAlNOH3tqHXo0ZZYYQegZQZbPqUI3fcWME" // Add your API key
  });

  return isLoaded ? <Map /> : null;
}