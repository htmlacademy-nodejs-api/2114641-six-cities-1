import { Expose } from 'class-transformer';
import { Amenity } from '../../../types/amenity.enum';
import { Location } from '../../../types/location.type';

export class OfferRdo {
  @Expose()
  public id!: string;

  @Expose()
  public name!: string;

  @Expose()
  public description!: string;

  @Expose()
  public city!: string;

  @Expose()
  public preview!: string;

  @Expose()
  public photos!: string[];

  @Expose()
  public premium!: boolean;

  @Expose()
  public rating!: number;

  @Expose()
  public numberOfRooms!: number;

  @Expose()
  public numberOfGuests!: number;

  @Expose()
  public cost!: number;

  @Expose()
  public propertyType!: string;

  @Expose()
  public commentsCount!: number;

  @Expose()
  public location!: Location;

  @Expose()
  public amenities!: Amenity[];

  @Expose({ name: 'userId' })
  public userId!: string;
}
