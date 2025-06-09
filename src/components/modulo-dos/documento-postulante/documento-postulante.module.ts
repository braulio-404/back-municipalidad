import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DocumentoPostulanteService } from './documento-postulante.service';
import { DocumentoPostulanteController } from './documento-postulante.controller';
import { DocumentoPostulante } from './entities/documento-postulante.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DocumentoPostulante])],
  controllers: [DocumentoPostulanteController],
  providers: [DocumentoPostulanteService],
  exports: [DocumentoPostulanteService],
})
export class DocumentoPostulanteModule {}
