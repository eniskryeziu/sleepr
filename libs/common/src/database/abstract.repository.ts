import { Model, QueryFilter, Types, UpdateQuery } from 'mongoose';
import { AbstractDocument } from './abstract.schema';
import { Logger, NotFoundException } from '@nestjs/common';

export abstract class AbstractRepository<TDocument extends AbstractDocument> {
  protected abstract readonly logger: Logger;
  constructor(protected readonly model: Model<TDocument>) {}

  async create(document: Omit<TDocument, '_id'>): Promise<TDocument> {
    const createDocument = new this.model({
      _id: new Types.ObjectId(),
      ...document,
    });
    return (await createDocument.save()).toJSON() as unknown as TDocument;
  }

  async findOne(filterQuery: QueryFilter<TDocument>): Promise<TDocument> {
    const document = await this.model
      .findOne(filterQuery)
      .lean<TDocument>(true);
    if (!document) {
      this.logger.warn(
        '(FIND ONE)Document was not found with filterQuery',
        filterQuery,
      );
      throw new NotFoundException('Document not found');
    }
    return document;
  }

  async findOneAndUpdate(
    filterQuery: QueryFilter<TDocument>,
    update: UpdateQuery<TDocument>,
  ): Promise<TDocument> {
    const document = await this.model
      .findOneAndUpdate(filterQuery, update, { new: true })
      .lean<TDocument>(true);

    if (!document) {
      this.logger.warn(
        '(find one and update) Document was not found with filterQuery',
        filterQuery,
      );
      throw new NotFoundException('Document not found');
    }
    return document;
  }

  async find(filterQuery: QueryFilter<TDocument>): Promise<TDocument[]> {
    const documents = await this.model
      .find(filterQuery)
      .lean<TDocument[]>(true);
    return documents;
  }

  async findOneAndDelete(
    filterQuery: QueryFilter<TDocument>,
  ): Promise<TDocument> {
    const document = await this.model
      .findOneAndDelete(filterQuery)
      .lean<TDocument>();

    if (!document) {
      this.logger.warn(
        '(find one and delete) Document was not found with filterQuery',
        filterQuery,
      );
      throw new NotFoundException('Document not found');
    }

    return document;
  }
}
