import { IsString, IsNotEmpty, IsDateString, IsEnum, IsOptional, IsArray } from 'class-validator';

export class CreateFormularioDto {
    @IsNotEmpty()
    @IsString()
    cargo: string;

    @IsOptional()
    @IsString()
    descripcion?: string;

    @IsOptional()
    @IsString()
    requisitos?: string;

    @IsDateString()
    fechaInicio: string;

    @IsDateString()
    fechaTermino: string;

    @IsOptional()
    @IsEnum(['Activo', 'Inactivo'])
    estado?: 'Activo' | 'Inactivo';

    @IsOptional()
    @IsArray()
    requisitosSeleccionados?: number[];
} 