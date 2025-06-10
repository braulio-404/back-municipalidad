import { IsString, IsOptional, IsNotEmpty, IsEnum, IsNumber, IsEmail, IsInt, IsDate } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateOfertaTrabajoDto {
    @ApiProperty({ description: 'Título de la oferta de trabajo' })
    @IsString()
    @IsNotEmpty()
    tituloOferta: string;

    @ApiProperty({ description: 'Descripción detallada de la oferta' })
    @IsString()
    @IsNotEmpty()
    descripcion: string;

    @ApiProperty({ description: 'Ubicación del trabajo' })
    @IsString()
    @IsNotEmpty()
    ubicacion: string;

    @ApiProperty({ description: 'Modalidad de trabajo', enum: ['presencial', 'remoto', 'híbrido'] })
    @IsString()
    @IsNotEmpty()
    modalidad: string;

    @ApiProperty({ description: 'Tipo de contrato', enum: ['full-time', 'part-time', 'temporal', 'por proyecto'] })
    @IsString()
    @IsNotEmpty()
    tipoContrato: string;

    @ApiProperty({ description: 'Salario mínimo', required: false })
    @IsNumber()
    @IsOptional()
    salarioMinimo?: number;

    @ApiProperty({ description: 'Salario máximo', required: false })
    @IsNumber()
    @IsOptional()
    salarioMaximo?: number;

    @ApiProperty({ description: 'Requisitos del puesto', required: false })
    @IsString()
    @IsOptional()
    requisitos?: string;

    @ApiProperty({ description: 'Beneficios ofrecidos', required: false })
    @IsString()
    @IsOptional()
    beneficios?: string;

    @ApiProperty({ description: 'Experiencia requerida', enum: ['junior', 'semi-senior', 'senior'], required: false })
    @IsString()
    @IsOptional()
    experienciaRequerida?: string;

    @ApiProperty({ description: 'Nivel de educación', enum: ['técnico', 'universitario', 'postgrado'], required: false })
    @IsString()
    @IsOptional()
    nivelEducacion?: string;

    @ApiProperty({ description: 'Fecha de publicación' })
    @IsDate()
    @Type(() => Date)
    fechaPublicacion: Date;

    @ApiProperty({ description: 'Fecha de cierre' })
    @IsDate()
    @Type(() => Date)
    fechaCierre: Date;

    @ApiProperty({ description: 'Estado de la oferta', enum: ['activa', 'cerrada', 'pausada', 'finalizada'], required: false, default: 'activa' })
    @IsEnum(['activa', 'cerrada', 'pausada', 'finalizada'])
    @IsOptional()
    estado?: string;

    @ApiProperty({ description: 'Contacto de RRHH', required: false })
    @IsString()
    @IsOptional()
    contactoRRHH?: string;

    @ApiProperty({ description: 'Email de contacto', required: false })
    @IsEmail()
    @IsOptional()
    emailContacto?: string;

    @ApiProperty({ description: 'Teléfono de contacto', required: false })
    @IsString()
    @IsOptional()
    telefonoContacto?: string;

    @ApiProperty({ description: 'Número de vacantes', default: 0 })
    @IsInt()
    @IsOptional()
    numeroVacantes?: number;

    @ApiProperty({ description: 'Jornada laboral', required: false })
    @IsString()
    @IsOptional()
    jornada?: string;
}
