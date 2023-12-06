import { RentalOffer } from '../../types/rental-offer.type';
import { PropertyType } from '../../types/property.enum';
import { Amenity } from '../../types/amenity.enum';

export function createOffer(offerData: string): RentalOffer {
  const [
    name,
    description,
    createdAt,
    city,
    preview,
    photos,
    premium,
    favorite,
    rating,
    numberOfRooms,
    numberOfGuests,
    coast,
    propertyType,
    createdBy,
    commentsCount,
    location,
    amenities,
  ] = offerData.replace('\n', '').split('\t');

  return {
    name,
    description,
    createdAt: new Date(createdAt),
    city,
    preview,
    photos: photos.split(';'),
    premium: Boolean(Number(premium)),
    favorite: Boolean(Number(favorite)),
    rating: Number.parseFloat(rating),
    numberOfRooms: Number.parseInt(numberOfRooms, 10),
    numberOfGuests: Number.parseInt(numberOfGuests, 10),
    coast: Number.parseFloat(coast),
    propertyType: propertyType as PropertyType,
    createdBy,
    commentsCount: Number.parseInt(commentsCount, 10),
    location: (() => {
      const [latitude, longitude] = location.split(';');

      return {
        latitude: Number.parseFloat(latitude),
        longitude: Number.parseFloat(longitude),
      };
    })(),
    amenities: amenities.split(';') as Amenity[],
  };
}
