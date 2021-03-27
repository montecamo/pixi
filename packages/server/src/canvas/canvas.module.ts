import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CanvasController } from './canvas.controller';
import { CanvasService } from './canvas.service';
import { Canvas, CanvasSchema } from './canvas.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Canvas.name, schema: CanvasSchema }]),
  ],
  controllers: [CanvasController],
  providers: [CanvasService],
})
export class CanvasModule {}
