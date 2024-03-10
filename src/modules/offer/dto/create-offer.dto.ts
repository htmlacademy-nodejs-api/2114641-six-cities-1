import { Amenity } from '../../../types/amenity.enum';
import { Location } from '../../../types/location.type';
import { PropertyType } from '../../../types/property.enum';

export class CreateOfferDto {
  public name!: string;
  public description!: string;
  public city!: string;
  public preview!: string;
  public photos!: string[];
  public premium!: boolean;
  public favorite!: boolean;
  public numberOfRooms!: number;
  public numberOfGuests!: number;
  public coast!: number;
  public propertyType!: PropertyType;
  public location!: Location;
  public amenities!: Amenity[];
  public userId!: string;
}
