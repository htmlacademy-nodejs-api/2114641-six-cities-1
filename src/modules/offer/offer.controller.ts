import { inject, injectable } from 'inversify';
import { Request, Response } from 'express';
import { Controller } from '../../core/controller/controller.abstract.js';
import { LoggerInterface } from '../../core/logger/logger.interface.js';
import { AppComponent } from '../../types/app-component.enum.js';
import { HttpMethod } from '../../types/http-method.enum.js';
import { OfferServiceInterface } from './offer-service.interface.js';
import { fillDTO } from '../../core/helpers/index.js';
import { OfferRdo } from './rdo/offer.rdo.js';
import { CreateOfferDto } from './dto/create-offer.dto.js';
import { UpdateOfferDto } from './dto/update-offer.dto.js';
import { HttpError } from '../../core/errors/http-error.js';
import { StatusCodes } from 'http-status-codes';
import { OfferDetailsRdo } from './rdo/offer-details.rdo.js';
import { OffersByCityParams, OfferDetailsParams } from './offer.controller.types.js';
import { CommentServiceInterface } from '../comment/comment-service.interface.js';
import { ValidateObjectIdMiddleware } from '../../core/middleware/validate-objectid.middleware.js';
import { ValidateDtoMiddleware } from '../../core/middleware/validate-dto.middleware.js';
import { DocumentExistsMiddleware } from '../../core/middleware/document-exists.middleware.js';
import { PrivateRouteMiddleware } from '../../core/middleware/private-route.middleware.js';
import { UserServiceInterface } from '../user/user-service.interface.js';

@injectable()
export class OfferController extends Controller {
  constructor(
    @inject(AppComponent.LoggerInterface) protected readonly logger: LoggerInterface,
    @inject(AppComponent.OfferServiceInterface) private readonly offerService: OfferServiceInterface,
    @inject(AppComponent.CommentServiceInterface) private readonly commentService: CommentServiceInterface,
    @inject(AppComponent.UserServiceInterface) private readonly userService: UserServiceInterface,
  ) {
    super(logger);

    this.logger.info('Register routes for OfferController…');

    this.addRoute({ path: '/', method: HttpMethod.Get, handler: this.index });
    this.addRoute({
      path: '/',
      method: HttpMethod.Post,
      handler: this.create,
      middlewares: [new PrivateRouteMiddleware(), new ValidateDtoMiddleware(CreateOfferDto)],
    });
    this.addRoute({
      path: '/:offerId/addToFavorite',
      method: HttpMethod.Patch,
      handler: this.addToFavorite,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware('offerId'),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId'),
      ],
    });
    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Get,
      handler: this.findById,
      middlewares: [
        new ValidateObjectIdMiddleware('offerId'),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId'),
      ],
    });
    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Delete,
      handler: this.delete,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware('offerId'),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId'),
      ],
    });
    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Patch,
      handler: this.update,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware('offerId'),
        new ValidateDtoMiddleware(UpdateOfferDto),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId'),
      ],
    });
    this.addRoute({ path: '/:city/premium', method: HttpMethod.Get, handler: this.findPremiumByCity });
  }

  public async index({ user }: Request, res: Response): Promise<void> {
    const userData = await this.userService.findByEmail(user.email);

    const favoriteList = userData?.favoriteList || [];

    const offers = await this.offerService.findOffersList(favoriteList);

    const offersToResponse = fillDTO(OfferRdo, offers);

    this.ok(res, offersToResponse);
  }

  public async addToFavorite({ params, user }: Request<OfferDetailsParams>, res: Response): Promise<void> {
    const { offerId } = params;

    await this.userService.addOfferToFavorite(user.email, offerId);

    this.noContent(res, null);
  }

  public async create(
    { body }: Request<Record<string, unknown>, Record<string, unknown>, CreateOfferDto>,
    res: Response,
  ): Promise<void> {
    const result = await this.offerService.create(body);
    const offer = await this.offerService.findById(result.id);
    const rating = await this.commentService.getRatingByOfferId(result.id);

    this.created(res, fillDTO(OfferRdo, { ...offer?.toObject(), rating }));
  }

  public async findPremiumByCity({ params }: Request<OffersByCityParams>, res: Response): Promise<void> {
    const { city } = params;

    const offers = await this.offerService.findPremiumByCity(city);

    this.ok(res, fillDTO(OfferRdo, offers));
  }

  public async findById({ params }: Request<OfferDetailsParams>, res: Response): Promise<void> {
    const { offerId } = params;

    const offer = await this.offerService.findById(offerId);

    if (!offer) {
      throw new HttpError(StatusCodes.NOT_FOUND, `Offer with id ${offerId} not found.`, 'OfferController');
    }

    const rating = await this.commentService.getRatingByOfferId(offer.id);

    this.ok(res, fillDTO(OfferDetailsRdo, { ...offer.toObject(), rating }));
  }

  public async delete({ params }: Request<OfferDetailsParams>, res: Response): Promise<void> {
    const { offerId } = params;
    const offer = await this.offerService.deleteById(offerId);
    await this.commentService.deleteByOfferId(offerId);

    this.noContent(res, offer);
  }

  public async update(
    { body, params }: Request<OfferDetailsParams, Record<string, unknown>, UpdateOfferDto>,
    res: Response,
  ): Promise<void> {
    const updatedOffer = await this.offerService.updateById(params.offerId, body);
    const rating = await this.commentService.getRatingByOfferId(updatedOffer?.id);

    this.ok(res, fillDTO(OfferRdo, { ...updatedOffer?.toObject(), rating }));
  }
}
