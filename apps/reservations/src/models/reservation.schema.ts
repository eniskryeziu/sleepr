import { AbstractDocument } from '@app/common/database/abstract.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class ReservationDocument extends AbstractDocument {
  @Prop()
  userId!: string;

  @Prop()
  timestramp!: Date;

  @Prop()
  startDate!: Date;

  @Prop()
  endDate!: Date;

  @Prop()
  invoiceId!: string;
}

export const ReservationSchema =
  SchemaFactory.createForClass(ReservationDocument);
