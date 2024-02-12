import { inject, injectable } from 'inversify';
import { Request, Response } from 'express';
import { Controller } from '../../core/controller/controller.abstract.js';
import { LoggerInterface } from '../../core/logger/logger.interface.js';
import { AppComponent } from '../../types/app-component.enum.js';
import { HttpMethod } from '../../types/http-method.enum.js';
import { OfferServiceInterface } from './offer-service.interface.js';
import { fillDTO } from '../../core/helpers/index.js';
import { OfferRdo } from './rdo/offer.rdo.js';
import { CreateOfferDto } from './dto/create-offer.dto';
import { UpdateOfferDto } from './dto/update-offer.dto.js';
import { HttpError } from '../../core/errors/http-error.js';
import { StatusCodes } from 'http-status-codes';
import { OfferDetailsRdo } from './rdo/offer-details.rdo.js';
import { OffersByCityParams, OfferDetailsParams } from './offer.controller.types.js';

@injectable()
export class OfferController extends Controller {
  constructor(
    @inject(AppComponent.LoggerInterface) protected readonly logger: LoggerInterface,
    @inject(AppComponent.OfferServiceInterface) private readonly offerService: OfferServiceInterface,
  ) {
    super(logger);

    this.logger.info('Register routes for OfferController…');

    this.addRoute({ path: '/', method: HttpMethod.Get, handler: this.index });
    this.addRoute({ path: '/', method: HttpMethod.Post, handler: this.create });
    this.addRoute({ path: '/:offerId', method: HttpMethod.Get, handler: this.findById });
    this.addRoute({ path: '/:offerId', method: HttpMethod.Delete, handler: this.delete });
    this.addRoute({ path: '/:offerId', method: HttpMethod.Patch, handler: this.update });
    this.addRoute({ path: '/:city/premium', method: HttpMethod.Get, handler: this.findPremiumByCity });
    this.addRoute({ path: '/:offerId/toggle-favorite', method: HttpMethod.Patch, handler: this.toggleFavoriteById });
  }

  public async index(_req: Request, res: Response): Promise<void> {
    const offers = await this.offerService.findOffersList();

    const offersToResponse = fillDTO(OfferRdo, offers);

    this.ok(res, offersToResponse);
  }

  public async create(
    { body }: Request<Record<string, unknown>, Record<string, unknown>, CreateOfferDto>,
    res: Response,
  ): Promise<void> {
    const result = await this.offerService.create(body);

    this.created(res, fillDTO(OfferRdo, result));
  }

  public async toggleFavoriteById({ params }: Request<OfferDetailsParams>, res: Response): Promise<void> {
    const { offerId } = params;
    const offer = await this.offerService.toggleFavorite(offerId);

    if (!offer) {
      throw new HttpError(StatusCodes.NOT_FOUND, `Offer with id ${offerId} not found.`, 'OfferController');
    }

    this.ok(res, fillDTO(OfferRdo, offer));
  }

  public async findPremiumByCity({ params }: Request<OffersByCityParams>, res: Response): Promise<void> {
    const { city } = params;

    const offers = await this.offerService.findPremiumByCity(city);

    const offersToResponse = fillDTO(OfferRdo, offers);

    this.ok(res, offersToResponse);
  }

  public async findById({ params }: Request<OfferDetailsParams>, res: Response): Promise<void> {
    const { offerId } = params;

    const offer = await this.offerService.findById(offerId);

    if (!offer) {
      throw new HttpError(StatusCodes.NOT_FOUND, `Offer with id ${offerId} not found.`, 'OfferController');
    }

    this.ok(res, fillDTO(OfferDetailsRdo, offer));
  }

  public async delete({ params }: Request<OfferDetailsParams>, res: Response): Promise<void> {
    const { offerId } = params;
    const offer = await this.offerService.deleteById(offerId);

    if (!offer) {
      throw new HttpError(StatusCodes.NOT_FOUND, `Offer with id ${offerId} not found.`, 'OfferController');
    }

    this.noContent(res, offer);
  }

  public async update(
    { body, params }: Request<OfferDetailsParams, Record<string, unknown>, UpdateOfferDto>,
    res: Response,
  ): Promise<void> {
    const updatedOffer = await this.offerService.updateById(params.offerId, body);

    if (!updatedOffer) {
      throw new HttpError(StatusCodes.NOT_FOUND, `Offer with id ${params.offerId} not found.`, 'OfferController');
    }

    this.ok(res, fillDTO(OfferRdo, updatedOffer));
  }
}
