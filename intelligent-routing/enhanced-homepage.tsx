import { PropertyProvider } from "@/components/HomePage";
import HomePage from "@/components/HomePage";

export default function Home() {
  return (
    <PropertyProvider>
      <HomePage />
    </PropertyProvider>
  );
}