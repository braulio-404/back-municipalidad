import { IsString, IsOptional, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateDocumentoPostulanteDto {
    @ApiProperty({ description: 'ID del postulante' })
    @IsString()
    @IsNotEmpty()
    postulanteID: string;

    @ApiProperty({ description: 'Nombre del archivo', example: 'curriculum_vitae.pdf' })
    @IsString()
    @IsNotEmpty()
    nombreArchivo: string;

    @ApiProperty({ description: 'Tipo de archivo', example: 'pdf' })
    @IsString()
    @IsNotEmpty()
    tipoArchivo: string;

    @ApiProperty({ description: 'Descripción del documento', required: false })
    @IsString()
    @IsOptional()
    descripcion?: string;

    @ApiProperty({ description: 'Contenido del documento', required: false })
    @IsString()
    @IsOptional()
    contenido?: string;
}
