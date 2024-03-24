import { Amenity } from '../../../types/amenity.enum';
import { Location } from '../../../types/location.type';
import { PropertyType } from '../../../types/property.enum';
import { IsArray, IsEnum, IsInt, IsMongoId, MaxLength, Min, MinLength, IsBoolean } from 'class-validator';

export class CreateOfferDto {
  @MinLength(10, { message: 'Minimum name length must be 10' })
  @MaxLength(100, { message: 'Maximum name length must be 100' })
  public name!: string;

  @MinLength(20, { message: 'Minimum description length must be 20' })
  @MaxLength(1024, { message: 'Maximum description length must be 1024' })
  public description!: string;

  public city!: string;
  public preview!: string;
  public photos!: string[];

  @IsBoolean()
  public premium!: boolean;

  @IsBoolean()
  public favorite!: boolean;

  @IsInt({ message: 'Number of rooms must be an integer' })
  @Min(1, { message: 'Minimum number of rooms must is 1' })
  public numberOfRooms!: number;

  @IsInt({ message: 'Number of rooms must be an integer' })
  public numberOfGuests!: number;

  @IsInt({ message: 'Price must be an integer' })
  @Min(100, { message: 'Minimum price is 100' })
  public cost!: number;

  @IsEnum(PropertyType, { message: 'type must be PropertyType' })
  public propertyType!: PropertyType;

  public location!: Location;

  @IsArray({ message: 'Field amenities must be an array' })
  @IsEnum({ each: true, message: 'Amenities field must be an array of valid Amenities' })
  public amenities!: Amenity[];

  @IsMongoId({ message: 'userId field must be valid an id' })
  public userId!: string;
}
