import { useEffect } from "react";
import { Redirect } from "expo-router";

export default function Index() {
  // Redirect directly to home page
  return <Redirect href="/(tabs)/home" />;
}
