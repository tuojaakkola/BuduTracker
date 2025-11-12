import { useEffect } from "react";
import { Redirect } from "expo-router";

export default function Index() {
  // Uudelleenohjaa suoraan home-sivulle
  return <Redirect href="/(tabs)/home" />;
}
