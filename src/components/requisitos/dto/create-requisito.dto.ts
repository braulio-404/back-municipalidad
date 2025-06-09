import { IsString, IsNotEmpty, IsEnum, IsBoolean, IsOptional } from 'class-validator';

export class CreateRequisitoDto {
    @IsNotEmpty()
    @IsString()
    nombre: string;

    @IsOptional()
    @IsString()
    descripcion?: string;

    @IsEnum(['documento', 'certificado', 'titulo', 'experiencia', 'otro'])
    tipo: 'documento' | 'certificado' | 'titulo' | 'experiencia' | 'otro';

    @IsBoolean()
    obligatorio: boolean;

    @IsOptional()
    @IsBoolean()
    activo?: boolean;

    @IsOptional()
    @IsBoolean()
    subeArchivo?: boolean;
} 