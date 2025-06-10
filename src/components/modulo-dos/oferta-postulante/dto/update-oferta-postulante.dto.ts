import { PartialType } from '@nestjs/swagger';
import { CreateOfertaPostulanteDto } from './create-oferta-postulante.dto';

export class UpdateOfertaPostulanteDto extends PartialType(CreateOfertaPostulanteDto) {}
