import { inject, injectable } from 'inversify';
import { DocumentType, types } from '@typegoose/typegoose';
import { CommentServiceInterface } from './comment-service.interface.js';
import { AppComponent } from '../../types/app-component.enum.js';
import { CreateCommentDto } from './dto/create-comment.dto.js';
import { CommentEntity } from './comment.entity.js';
import { COMMENTS_LIMIT } from './comment.constants.js';
import { SortType } from '../../types/sort.type.js';
import { LoggerInterface } from '../../core/logger/logger.interface.js';

@injectable()
export class CommentService implements CommentServiceInterface {
  constructor(
    @inject(AppComponent.LoggerInterface) private readonly logger: LoggerInterface,
    @inject(AppComponent.CommentModel) private readonly commentModel: types.ModelType<CommentEntity>,
  ) {}

  public async create(dto: CreateCommentDto): Promise<DocumentType<CommentEntity>> {
    const comment = await this.commentModel.create(dto);

    this.logger.info('New comment created');

    return comment.populate(['userId', 'offerId']);
  }

  public async findByOfferId(offerId: string): Promise<DocumentType<CommentEntity>[]> {
    return this.commentModel
      .find({ offerId })
      .sort({ createdAt: SortType.Up })
      .limit(COMMENTS_LIMIT)
      .populate(['userId'])
      .exec();
  }

  public async deleteByOfferId(offerId: string): Promise<number> {
    const result = await this.commentModel.deleteMany({ offerId }).exec();

    return result.deletedCount;
  }

  public async getRatingByOfferId(offerId: string): Promise<number> {
    const result = await this.commentModel.find({ offerId }).exec();

    if (result.length === 0) {
      return 0;
    }

    const rating = result.reduce((acc, item) => (acc += item.rating), 0) / result.length;

    return rating;
  }
}
