import { Amenity } from './amenity.enum';
import { Location } from './location.type';
import { PropertyType } from './property.enum';
import { User } from './user.type.js';

export type Offer = {
  name: string;
  description: string;
  city: string;
  preview: string;
  photos: string[];
  premium: boolean;
  favorite: boolean;
  rating: number;
  numberOfRooms: number;
  numberOfGuests: number;
  cost: number;
  propertyType: PropertyType;
  commentsCount: number;
  location: Location;
  amenities: Amenity[];
  user: User;
};
