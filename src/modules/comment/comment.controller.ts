import { inject, injectable } from 'inversify';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { Controller } from '../../core/controller/controller.abstract.js';
import { LoggerInterface } from '../../core/logger/logger.interface.js';
import { AppComponent } from '../../types/app-component.enum.js';
import { HttpMethod } from '../../types/http-method.enum.js';
import { fillDTO } from '../../core/helpers/index.js';
import { CommentServiceInterface } from '../comment/comment-service.interface.js';
import { CommentsParams } from './comment.controller.types.js';
import { ValidateObjectIdMiddleware } from '../../core/middleware/validate-objectid.middleware.js';
import { CommentRdo } from './rdo/comment.rdo.js';
import { CreateCommentDto } from './dto/create-comment.dto.js';
import { DocumentExistsMiddleware } from '../../core/middleware/document-exists.middleware.js';
import { OfferServiceInterface } from '../offer/offer-service.interface.js';
import { HttpError } from '../../core/errors/http-error.js';
import { PrivateRouteMiddleware } from '../../core/middleware/private-route.middleware.js';

@injectable()
export class CommentController extends Controller {
  constructor(
    @inject(AppComponent.LoggerInterface) protected readonly logger: LoggerInterface,
    @inject(AppComponent.OfferServiceInterface) private readonly offerService: OfferServiceInterface,
    @inject(AppComponent.CommentServiceInterface) private readonly commentService: CommentServiceInterface,
  ) {
    super(logger);

    this.logger.info('Register routes for CommentController…');

    this.addRoute({
      path: '/',
      method: HttpMethod.Post,
      handler: this.create,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware('offerId'),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId'),
      ],
    });

    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Get,
      handler: this.findByOfferId,
      middlewares: [new ValidateObjectIdMiddleware('offerId')],
    });
  }

  public async create(
    { body, user }: Request<Record<string, unknown>, Record<string, unknown>, CreateCommentDto>,
    res: Response,
  ): Promise<void> {
    if (!(await this.offerService.exists(body.offerId))) {
      throw new HttpError(StatusCodes.NOT_FOUND, `Offer with id ${body.offerId} not found.`, 'CommentController');
    }

    const comment = await this.commentService.create({ ...body, userId: user.id });
    this.created(res, fillDTO(CommentRdo, comment));
  }

  public async findByOfferId({ params }: Request<CommentsParams>, res: Response): Promise<void> {
    const { offerId } = params;

    const comments = await this.commentService.findByOfferId(offerId);

    this.ok(res, fillDTO(CommentRdo, comments));
  }
}
