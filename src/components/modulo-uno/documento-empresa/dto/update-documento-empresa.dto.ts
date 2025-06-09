import { PartialType } from '@nestjs/swagger';
import { CreateDocumentoEmpresaDto } from './create-documento-empresa.dto';

export class UpdateDocumentoEmpresaDto extends PartialType(CreateDocumentoEmpresaDto) {}
