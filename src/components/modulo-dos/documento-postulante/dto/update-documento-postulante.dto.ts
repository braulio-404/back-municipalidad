import { PartialType } from '@nestjs/swagger';
import { CreateDocumentoPostulanteDto } from './create-documento-postulante.dto';

export class UpdateDocumentoPostulanteDto extends PartialType(CreateDocumentoPostulanteDto) {}
