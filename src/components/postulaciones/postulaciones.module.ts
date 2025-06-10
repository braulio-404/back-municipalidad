import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostulacionesService } from './postulaciones.service';
import { PostulacionesController } from './postulaciones.controller';
import { Postulacion } from './entities/postulacion.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Postulacion])],
  controllers: [PostulacionesController],
  providers: [PostulacionesService],
  exports: [PostulacionesService]
})
export class PostulacionesModule {} 