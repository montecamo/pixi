import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import type { Fibers } from './types';

export type CanvasDocument = Canvas & Document;

@Schema()
export class Canvas {
  @Prop({ required: true, unique: true, dropDups: true })
  id: string;

  @Prop([Object])
  fibers: Fibers;
}

export const CanvasSchema = SchemaFactory.createForClass(Canvas);
