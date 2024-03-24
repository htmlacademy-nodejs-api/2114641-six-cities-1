import { Amenity } from '../../../types/amenity.enum';
import { IsArray, IsEnum, IsInt, MaxLength, IsOptional, Min, MinLength, IsBoolean } from 'class-validator';
export class UpdateOfferDto {
  @IsOptional()
  @MinLength(10, { message: 'Minimum name length must be 10' })
  @MaxLength(100, { message: 'Maximum name length must be 100' })
  public name?: string;

  @IsOptional()
  @MinLength(20, { message: 'Minimum description length must be 20' })
  @MaxLength(1024, { message: 'Maximum description length must be 1024' })
  public description?: string;

  public preview?: string;
  public photos?: string[];

  @IsOptional()
  @IsBoolean()
  public premium?: boolean;

  @IsOptional()
  @IsBoolean()
  public favorite?: boolean;

  @IsOptional()
  @IsInt({ message: 'Number of rooms must be an integer' })
  @Min(1, { message: 'Minimum number of rooms must is 1' })
  public numberOfRooms!: number;

  @IsOptional()
  @IsInt({ message: 'Number of rooms must be an integer' })
  public numberOfGuests?: number;

  @IsOptional()
  @IsInt({ message: 'Price must be an integer' })
  @Min(100, { message: 'Minimum price is 100' })
  public cost?: number;

  @IsOptional()
  @IsArray({ message: 'Field amenities must be an array' })
  @IsEnum({ each: true, message: 'Amenities field must be an array of valid Amenities' })
  public amenities?: Amenity[];
}
