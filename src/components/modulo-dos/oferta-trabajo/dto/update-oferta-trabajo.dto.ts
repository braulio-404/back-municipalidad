import { PartialType } from '@nestjs/swagger';
import { CreateOfertaTrabajoDto } from './create-oferta-trabajo.dto';

export class UpdateOfertaTrabajoDto extends PartialType(CreateOfertaTrabajoDto) {}
