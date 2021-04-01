import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Canvas, CanvasDocument } from './canvas.schema';
import { CreateCanvasDto } from './dto/create-canvas.dto';

import type { Fibers } from './types';

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

  async updateCanvas(canvasId: string, fibers: Fibers): Promise<boolean> {
    await this.canvasModel.updateOne(
      { id: canvasId },
      {
        $push: { fibers: { $each: fibers } },
      },
    );

    return true;
  }

  async getCanvas(canvasId: string): Promise<CanvasDocument | null> {
    return this.canvasModel.findOne({ id: canvasId }).exec();
  }
}
