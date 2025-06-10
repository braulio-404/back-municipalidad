import { IsNotEmpty, IsString, IsOptional, IsEnum } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateProyectoEmpresaDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        description: 'ID del proyecto',
        example: 'uuid-del-proyecto'
    })
    proyectoID: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        description: 'ID de la empresa',
        example: 'uuid-de-la-empresa'
    })
    empresaID: string;

    @IsEnum(['pendiente', 'aprobada', 'rechazada', 'en_revision'])
    @IsOptional()
    @ApiProperty({
        description: 'Estado de la postulación',
        enum: ['pendiente', 'aprobada', 'rechazada', 'en_revision'],
        default: 'pendiente',
        required: false
    })
    estado?: string;

    @IsString()
    @IsOptional()
    @ApiProperty({
        description: 'Observaciones adicionales',
        example: 'Empresa tiene experiencia previa en proyectos similares',
        required: false
    })
    observaciones?: string;
}
