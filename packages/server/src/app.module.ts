import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CanvasModule } from './canvas/canvas.module';

import { MongooseModule } from '@nestjs/mongoose';

const DATABASE_URL =
  process.env.NODE_ENV === 'development'
    ? 'mongodb://localhost/pixi'
    : 'mongodb://mongo:27017/pixi';

@Module({
  imports: [MongooseModule.forRoot(DATABASE_URL), CanvasModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
