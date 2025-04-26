import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HelpersModule } from '@src/app/helpers/helpers.module';
import { AppFileStorageController } from './controllers/app/fileUpload.app.controller';
import { AppGalleryController } from './controllers/app/gallery.app.controller';
import { FileStorageInternalController } from './controllers/employer/fileUpload.employer.controller';
import { GalleryEmployerController } from './controllers/employer/gallery.employer.controller';
import { InternalFileStorageController } from './controllers/internal/fileUpload.internal.controller';
import { InternalGalleryController } from './controllers/internal/gallery.internal.controller';
import { Gallery } from './entities/gallery.entity';
import { FileUploadService } from './services/fileUpload.service';
import { GalleryService } from './services/gallery.service';

const entities = [Gallery];
const services = [FileUploadService, GalleryService];
const subscribers = [];

const controllers = [];
const appControllers = [AppFileStorageController, AppGalleryController];
const internalControllers = [InternalFileStorageController, InternalGalleryController];
const employerControllers = [FileStorageInternalController, GalleryEmployerController];

const modules = [HelpersModule, HttpModule];

@Module({
  imports: [...modules, TypeOrmModule.forFeature([...entities])],
  providers: [...services, ...subscribers],
  exports: [...services, ...subscribers],
  controllers: [...controllers, ...appControllers, ...internalControllers, ...employerControllers],
})
export class GalleryModule {}
