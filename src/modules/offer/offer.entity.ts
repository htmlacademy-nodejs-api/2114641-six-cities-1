import typegoose, { defaultClasses, getModelForClass, Ref } from '@typegoose/typegoose';
import { PropertyType } from '../../types/property.enum.js';
import { Location } from '../../types/location.type.js';
import { Amenity } from '../../types/amenity.enum.js';
import { UserEntity } from '../user/user.entity.js';

const { prop, modelOptions } = typegoose;

export interface OfferEntity extends defaultClasses.Base {}

@modelOptions({
  schemaOptions: {
    collection: 'offers',
  },
})
export class OfferEntity extends defaultClasses.TimeStamps {
  @prop({ trim: true, required: true })
  public name!: string;

  @prop({ trim: true })
  public description!: string;

  @prop({ required: true })
  public city!: string;

  @prop({ required: true })
  public preview!: string;

  @prop({ required: true })
  public photos!: string[];

  @prop({ default: false })
  public premium!: boolean;

  @prop({ default: false })
  public favorite!: boolean;

  @prop({ default: 0 })
  public rating!: number;

  @prop({ required: true })
  public numberOfRooms!: number;

  @prop({ required: true })
  public numberOfGuests!: number;

  @prop({ required: true })
  public coast!: number;

  @prop({ required: true })
  public propertyType!: PropertyType;

  @prop({ default: 0 })
  public commentsCount!: number;

  @prop({ required: true })
  public location!: Location;

  @prop({ required: true })
  public amenities!: Amenity[];

  @prop({
    ref: UserEntity,
    required: true,
  })
  public userId!: Ref<UserEntity>;
}

export const OfferModel = getModelForClass(OfferEntity);
