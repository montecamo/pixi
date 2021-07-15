import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CanvasModule } from './canvas/canvas.module';

import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [MongooseModule.forRoot('mongodb://mongo:27017/pixi'), CanvasModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
