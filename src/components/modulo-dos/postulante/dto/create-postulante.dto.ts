import { IsString, IsOptional, IsNotEmpty, IsEmail, IsEnum, IsNumber, IsBoolean, IsDate, IsArray, ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

class CreateDocumentoDto {
    @ApiProperty({ description: 'Tipo de documento', example: 'CV' })
    @IsString()
    @IsNotEmpty()
    tipoDocumento: string;

    @ApiProperty({ description: 'Archivo del documento', type: 'string', format: 'binary' })
    archivo: any; // Para archivos, se maneja como any en el DTO
}

export class CreatePostulanteDto {
    @ApiProperty({ description: 'Nombres del postulante' })
    @IsString()
    @IsNotEmpty()
    nombres: string;

    @ApiProperty({ description: 'Apellido paterno' })
    @IsString()
    @IsNotEmpty()
    apellidoPaterno: string;

    @ApiProperty({ description: 'RUT del postulante', example: '12345678-9' })
    @IsString()
    @IsNotEmpty()
    rut: string;

    @ApiProperty({ description: 'Email del postulante' })
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty({ description: 'Teléfono del postulante', required: false })
    @IsString()
    @IsOptional()
    telefono?: string;

    @ApiProperty({ description: 'ID del formulario asociado' })
    @IsNumber()
    @IsNotEmpty()
    @Type(() => Number)
    formulario_id: number;

    @ApiProperty({ description: 'Documentos del postulante', type: [CreateDocumentoDto], required: false })
    @IsArray()
    @IsOptional()
    @ValidateNested({ each: true })
    @Type(() => CreateDocumentoDto)
    documentos?: CreateDocumentoDto[];
}
