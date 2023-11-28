import { readFile } from 'node:fs/promises';
import { FileReaderInterface } from './file-reader.interface.js';
import { RentalOffer } from '../../types/rental-offer.type.js';
import { PropertyType } from '../../types/property.enum.js';
import { Amenity } from '../../types/amenity.enum.js';

export default class TSVFileReader implements FileReaderInterface {
  private rawData = '';

  constructor(public filename: string) { }

  public async read(): Promise<void> {
    this.rawData = await readFile(this.filename, { encoding: 'utf8' });
  }

  public toArray(): RentalOffer[] {
    if (!this.rawData) {
      return [];
    }

    return this.rawData
      .split('\n')
      .filter((row) => row.trim() !== '')
      .map((line) => line.split('\t'))
      .map(([name,
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
      ]) => ({
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
        location:(()=> {
          const [latitude, longitude] = location.split(';');

          return {
            latitude: Number.parseFloat(latitude),
            longitude: Number.parseFloat(longitude),
          };
        })(),
        amenities: amenities.split(';') as Amenity[],
      }));
  }
}
