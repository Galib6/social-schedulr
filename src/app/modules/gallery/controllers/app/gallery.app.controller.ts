import { Controller, Get, Param } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Gallery } from '../../entities/gallery.entity';
import { GalleryService } from '../../services/gallery.service';

@ApiTags('Gallery')
@ApiBearerAuth()
@Controller('app/gallery')
export class AppGalleryController {
  constructor(private readonly service: GalleryService) {}

  RELATIONS = {};

  @Get(':id')
  async findById(@Param('id') id: string): Promise<Gallery> {
    return this.service.findByIdBase(id, { relations: this.RELATIONS });
  }
}
