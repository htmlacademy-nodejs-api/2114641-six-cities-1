import dayjs from 'dayjs';
import { OfferGeneratorInterface } from './offer-generator.interface.js';
import { MockData } from '../../types/mock-data.type.js';
import { generateRandomValue, getRandomItem, getRandomItems } from '../../core/helpers/index.js';

import {
  MIN_PRICE,
  MAX_PRICE,
  FIRST_WEEK_DAY,
  LAST_WEEK_DAY,
  MIN_RATE,
  MAX_RATE,
  MIN_GUESTS,
  MAX_GUESTS,
  MIN_ROOMS,
  MAX_ROOMS,
  FALSE_VALUE,
} from './offer-generator.constants.js';

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
    const createdAt = dayjs().subtract(generateRandomValue(FIRST_WEEK_DAY, LAST_WEEK_DAY), 'day').toISOString();
    const favorite = FALSE_VALUE;
    const premium = generateRandomValue(0, 1).toString();
    const rating = generateRandomValue(MIN_RATE, MAX_RATE, 1).toString();
    const numberOfRooms = generateRandomValue(MIN_GUESTS, MAX_GUESTS).toString();
    const numberOfGuests = generateRandomValue(MIN_ROOMS, MAX_ROOMS).toString();
    const coast = generateRandomValue(MIN_PRICE, MAX_PRICE).toString();
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
