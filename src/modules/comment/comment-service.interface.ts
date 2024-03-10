import { DocumentType } from '@typegoose/typegoose';
import { CreateCommentDto } from './dto/create-comment.dto';
import { CommentEntity } from './comment.entity';

export interface CommentServiceInterface {
  create(dto: CreateCommentDto): Promise<DocumentType<CommentEntity>>;
  findByOfferId(offerId: string): Promise<DocumentType<CommentEntity>[]>;
  deleteByOfferId(offerId: string): Promise<number | null>;
  getRatingByOfferId(offerId: string): Promise<number | null>;
}
