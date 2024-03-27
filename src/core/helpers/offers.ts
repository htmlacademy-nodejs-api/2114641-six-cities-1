import { Offer } from '../../types/offer.type';
import { PropertyType } from '../../types/property.enum.js';
import { Amenity } from '../../types/amenity.enum';

export function createOffer(offerData: string): Offer {
  const [
    name,
    description,
    city,
    preview,
    photos,
    premium,
    favorite,
    rating,
    numberOfRooms,
    numberOfGuests,
    cost,
    propertyType,
    createdBy,
    commentsCount,
    location,
    amenities,
  ] = offerData.replace('\n', '').split('\t');

  return {
    name,
    description,
    city,
    preview,
    photos: photos.split(';'),
    premium: Boolean(Number(premium)),
    favorite: Boolean(Number(favorite)),
    rating: Number.parseFloat(rating),
    numberOfRooms: Number.parseInt(numberOfRooms, 10),
    numberOfGuests: Number.parseInt(numberOfGuests, 10),
    cost: Number.parseFloat(cost),
    propertyType: propertyType as PropertyType,
    commentsCount: Number.parseInt(commentsCount, 10),
    location: (() => {
      const [latitude, longitude] = location.split(';');

      return {
        latitude: Number.parseFloat(latitude),
        longitude: Number.parseFloat(longitude),
      };
    })(),
    amenities: amenities.split(';') as Amenity[],
    user: {
      email: createdBy,
      name: createdBy.split('@')[0],
      picture: 'pic.jpg',
    },
  };
}
