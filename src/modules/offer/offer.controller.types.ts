import { ParamsDictionary } from 'express-serve-static-core';

export type OffersByCityParams =
  | {
      city: string;
    }
  | ParamsDictionary;

export type OfferDetailsParams =
  | {
      offerId: string;
    }
  | ParamsDictionary;
