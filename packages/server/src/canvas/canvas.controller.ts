import {
  Controller,
  Get,
  Res,
  HttpStatus,
  Post,
  Body,
  Put,
  Query,
  NotFoundException,
  Delete,
  Param,
} from '@nestjs/common';
import { CanvasService } from './canvas.service';
import { CreateCanvasDto } from './dto/create-canvas.dto';

@Controller()
export class CanvasController {
  constructor(private canvasService: CanvasService) {}

  // add a canvas
  @Post('/create')
  async addCanvas(@Body() createCanvasDTO: CreateCanvasDto) {
    const canvas = await this.canvasService.create(createCanvasDTO);

    return {
      message: 'Canvas has been created successfully',
      canvas,
    };
  }

  @Post('/drop')
  async deleteCanvases() {
    await this.canvasService.deleteAllCanvases();

    return {
      message: 'Canvases has been deleted successfully',
    };
  }

  // Retrieve canvass list
  @Get('/canvases')
  async getAllCanvas() {
    const canvases = await this.canvasService.getAllCanvases();
    return canvases;
  }

  @Get('canvas/:canvasID')
  async getCanvas(@Res() res, @Param('canvasID') canvasID) {
    const canvas = await this.canvasService.getCanvas(canvasID);
    if (!canvas) throw new NotFoundException('Canvas does not exist!');
    return res.status(HttpStatus.OK).json(canvas);
  }
}
