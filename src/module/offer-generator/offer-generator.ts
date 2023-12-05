import dayjs from 'dayjs';
import { OfferGeneratorInterface } from './offer-generator.interface.js';
import { MockData } from '../../types/mock-data.type.js';
import { generateRandomValue, getRandomItem, getRandomItems } from '../../core/helpers/index.js';
import { Guests } from '../../types/guests.enum.js';
import { Price } from '../../types/price.enum.js';
import { Rating } from '../../types/rating.enum.js';
import { Week } from '../../types/week.enum.js';
import { Rooms } from '../../types/rooms.enum.js';

export const FALSE_VALUE = '0';
export default class OfferGenerator implements OfferGeneratorInterface {
  constructor(private readonly mockData: MockData) {}

  public generate(): string {
    const name = getRandomItem<string>(this.mockData.names);
    const createdBy = getRandomItem<string>(this.mockData.createdBy);
    const description = getRandomItem<string>(this.mockData.description);
    const city = getRandomItem<string>(this.mockData.city);
    const preview = getRandomItem<string>(this.mockData.preview);
    const photos = getRandomItems<string>(this.mockData.photos).join(';');
    const propertyType = getRandomItem<string>(this.mockData.propertyType);
    const location = getRandomItem<string>(this.mockData.location);
    const amenities = getRandomItems<string>(this.mockData.amenities).join(';');
    const createdAt = dayjs().subtract(generateRandomValue(Week.FirstDay, Week.LastDay), 'day').toISOString();
    const favorite = FALSE_VALUE;
    const premium = generateRandomValue(0, 1).toString();
    const rating = generateRandomValue(Rating.Min, Rating.Max, 1).toString();
    const numberOfRooms = generateRandomValue(Guests.Min, Guests.Max).toString();
    const numberOfGuests = generateRandomValue(Rooms.Min, Rooms.Max).toString();
    const coast = generateRandomValue(Price.Min, Price.Max).toString();
    const commentsCount = FALSE_VALUE;

    return [
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
    ].join('\t');
  }
}
