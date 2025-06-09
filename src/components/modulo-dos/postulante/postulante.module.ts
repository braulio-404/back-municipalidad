import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostulanteService } from './postulante.service';
import { PostulanteController } from './postulante.controller';
import { Postulante } from './entities/postulante.entity';
import { DocumentoPostulanteModule } from '../documento-postulante/documento-postulante.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Postulante]),
    DocumentoPostulanteModule
  ],
  controllers: [PostulanteController],
  providers: [PostulanteService],
  exports: [PostulanteService],
})
export class PostulanteModule {}
