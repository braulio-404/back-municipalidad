import { ApiProperty } from "@nestjs/swagger";
import { IsDate, IsNotEmpty, IsString } from "class-validator";

export class CreateDocumentoEmpresaDto {
    
    @IsNotEmpty()
    @IsString()
    @ApiProperty({
        description: 'ID de la empresa',
        example: '123e4567-e89b-12d3-a456-426614174000'
    })
    empresaID: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty({
        description: 'Nombre del archivo',
        example: 'documento.pdf'
    })
    nombreArchivo: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty({
        description: 'Tipo de archivo',
        example: 'pdf'
    })
    tipoArchivo: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty({
        description: 'Descripción del archivo',
        example: 'Documento de la empresa'
    })
    descripcion: string;

    @IsNotEmpty()
    @ApiProperty({
        description: 'Contenido del archivo',
        example: 'Contenido del archivo'
    })
    contenido: string;

    @IsNotEmpty()
    @IsDate()
    @ApiProperty({
        description: 'Fecha de subida del archivo',
        example: '2021-01-01'
    })
    fechaSubida: Date;
}
