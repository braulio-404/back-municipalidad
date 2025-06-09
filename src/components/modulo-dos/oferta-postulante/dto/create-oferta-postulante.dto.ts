import { IsString, IsOptional, IsNotEmpty, IsEnum, IsNumber, IsInt, IsDate } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateOfertaPostulanteDto {
    @ApiProperty({ description: 'ID de la oferta de trabajo' })
    @IsString()
    @IsNotEmpty()
    ofertaTrabajoID: string;

    @ApiProperty({ description: 'ID del postulante' })
    @IsString()
    @IsNotEmpty()
    postulanteID: string;

    @ApiProperty({ description: 'Fecha de postulación' })
    @IsDate()
    @Type(() => Date)
    fechaPostulacion: Date;

    @ApiProperty({ 
        description: 'Estado de la postulación', 
        enum: ['pendiente', 'en_revision', 'preseleccionado', 'entrevista', 'contratado', 'rechazado'],
        default: 'pendiente',
        required: false 
    })
    @IsEnum(['pendiente', 'en_revision', 'preseleccionado', 'entrevista', 'contratado', 'rechazado'])
    @IsOptional()
    estado?: string;

    @ApiProperty({ description: 'Carta de presentación', required: false })
    @IsString()
    @IsOptional()
    cartaPresentacion?: string;

    @ApiProperty({ description: 'Pretensión salarial del postulante', required: false })
    @IsNumber()
    @IsOptional()
    pretensionSalarial?: number;

    @ApiProperty({ 
        description: 'Disponibilidad de inicio', 
        enum: ['inmediata', '1 semana', '2 semanas', '1 mes'],
        required: false 
    })
    @IsString()
    @IsOptional()
    disponibilidadInicio?: string;

    @ApiProperty({ description: 'Observaciones del equipo de RRHH', required: false })
    @IsString()
    @IsOptional()
    observacionesRRHH?: string;

    @ApiProperty({ description: 'Fecha programada para entrevista', required: false })
    @IsDate()
    @Type(() => Date)
    @IsOptional()
    fechaEntrevista?: Date;

    @ApiProperty({ 
        description: 'Tipo de entrevista', 
        enum: ['presencial', 'online', 'telefónica'],
        required: false 
    })
    @IsString()
    @IsOptional()
    tipoEntrevista?: string;

    @ApiProperty({ description: 'Comentarios adicionales', required: false })
    @IsString()
    @IsOptional()
    comentarios?: string;

    @ApiProperty({ description: 'Puntuación del postulante (1-10)', minimum: 1, maximum: 10, required: false })
    @IsInt()
    @IsOptional()
    puntuacion?: number;
}
