import { PartialType } from '@nestjs/swagger';
import { CreateProyectoEmpresaDto } from './create-proyecto-empresa.dto';

export class UpdateProyectoEmpresaDto extends PartialType(CreateProyectoEmpresaDto) {}
