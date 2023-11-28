import { Amenity } from './amenity.enum';
import { Location } from './location.type';
import { PropertyType } from './property.enum';

export type RentalOffer = {
  name: string;
  description: string;
  createdAt: Date;
  city: string;
  preview: string;
  photos: string[];
  premium: boolean;
  favorite: boolean;
  rating: number;
  numberOfRooms: number;
  numberOfGuests: number;
  coast: number;
  propertyType: PropertyType;
  createdBy: string;
  commentsCount: number;
  location: Location;
  amenities: Amenity[];
}
