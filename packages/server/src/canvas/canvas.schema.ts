import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CanvasDocument = Canvas & Document;

@Schema()
export class Canvas {
  @Prop({ required: true, unique: true, dropDups: true })
  id: string;

  @Prop([Number])
  fibers: number[];
}

export const CanvasSchema = SchemaFactory.createForClass(Canvas);
