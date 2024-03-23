import { ParamsDictionary } from 'express-serve-static-core';

export type CommentsParams =
  | {
      offerId: string;
    }
  | ParamsDictionary;
