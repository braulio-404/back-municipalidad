import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FormulariosService } from './formularios.service';
import { FormulariosController } from './formularios.controller';
import { Formulario } from './entities/formulario.entity';
import { Requisito } from '../requisitos/entities/requisito.entity';
import { Postulante } from '../modulo-dos/postulante/entities/postulante.entity';
import { DocumentoPostulante } from '../modulo-dos/documento-postulante/entities/documento-postulante.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Formulario, Requisito, Postulante, DocumentoPostulante])],
  controllers: [FormulariosController],
  providers: [FormulariosService],
  exports: [FormulariosService]
})
export class FormulariosModule {} 