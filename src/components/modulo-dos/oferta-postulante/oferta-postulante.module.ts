import { Module } from '@nestjs/common';
import { OfertaPostulanteService } from './oferta-postulante.service';
import { OfertaPostulanteController } from './oferta-postulante.controller';

@Module({
  controllers: [OfertaPostulanteController],
  providers: [OfertaPostulanteService],
})
export class OfertaPostulanteModule {}
