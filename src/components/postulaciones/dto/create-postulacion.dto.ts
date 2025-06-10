import { IsString, IsNotEmpty, IsDateString, IsEnum, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreatePostulacionDto {
    @IsNotEmpty()
    @IsString()
    titulo: string;

    @IsNotEmpty()
    @IsString()
    descripcion: string;

    @IsDateString()
    fechaVencimiento: string;

    @IsOptional()
    @IsEnum(['activa', 'vencida'])
    estado?: 'activa' | 'vencida';
} 