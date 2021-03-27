import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CanvasController } from './canvas.controller';
import { CanvasService } from './canvas.service';
import { Canvas, CanvasSchema } from './canvas.schema';
import { CanvasGateway } from './canvas.gateway';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Canvas.name, schema: CanvasSchema }]),
  ],
  controllers: [CanvasController],
  providers: [CanvasService, CanvasGateway],
})
export class CanvasModule {}
