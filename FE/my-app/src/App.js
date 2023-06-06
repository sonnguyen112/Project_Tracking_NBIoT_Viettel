import { useLoadScript } from "@react-google-maps/api";
import Map from "./Map";
import "./styles.css";

export default function App() {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: "AIzaSyCZGuGc_SaQ2m2yWxaO1SBvKgofTqvAX7g" // Add your API key
  });

  return isLoaded ? <Map /> : null;
}