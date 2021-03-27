import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Canvas, CanvasDocument } from './canvas.schema';
import { CreateCanvasDto } from './dto/create-canvas.dto';

@Injectable()
export class CanvasService {
  constructor(
    @InjectModel(Canvas.name) private canvasModel: Model<CanvasDocument>,
  ) {}

  async create(createCanvasDto: CreateCanvasDto): Promise<Canvas> {
    const createdCanvas = new this.canvasModel(createCanvasDto);
    return createdCanvas.save();
  }

  async getAllCanvases(): Promise<Canvas[]> {
    return this.canvasModel.find().exec();
  }

  async deleteAllCanvases(): Promise<void> {
    return this.canvasModel.remove().exec();
  }
}
