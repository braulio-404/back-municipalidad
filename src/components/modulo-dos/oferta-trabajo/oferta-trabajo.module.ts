import { Module } from '@nestjs/common';
import { OfertaTrabajoService } from './oferta-trabajo.service';
import { OfertaTrabajoController } from './oferta-trabajo.controller';

@Module({
  controllers: [OfertaTrabajoController],
  providers: [OfertaTrabajoService],
})
export class OfertaTrabajoModule {}
