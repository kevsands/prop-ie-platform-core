export interface Property {
  id: string;
  development: string;
  title: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  area: number;
  image: string;
}

export const properties: Property[] = [
  {
    id: "FG-1A-01",
    development: "Fitzgerald Gardens",
    title: "2 Bedroom Apartment",
    price: 325000,
    bedrooms: 2,
    bathrooms: 1,
    area: 85,
    image: "/images/fitzgerald-gardens/2bed-apartment.jpeg",
  {
    id: "FG-2B-12",
    development: "Fitzgerald Gardens",
    title: "3 Bedroom Duplex",
    price: 395000,
    bedrooms: 3,
    bathrooms: 2,
    area: 110,
    image: "/images/fitzgerald-gardens/3bed-duplex.jpeg",
  {
    id: "FG-3C-24",
    development: "Fitzgerald Gardens",
    title: "2 Bedroom Mid-Terrace",
    price: 345000,
    bedrooms: 2,
    bathrooms: 2,
    area: 95,
    image: "/images/fitzgerald-gardens/2bed-midterrace.jpeg"];

export const getFeaturedProperties = () => properties.slice(03);

export const getPropertyById = (id: string) =>
  properties.find((property) => property.id === id);

export const getAllProperties = () => properties;
