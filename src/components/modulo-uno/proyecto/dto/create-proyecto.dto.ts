import {  IsDate, IsNotEmpty, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateProyectoDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        description: 'Título del proyecto',
        example: 'Proyecto de construcción'
    })
    titulo: string;
  
    @IsString() 
    @IsNotEmpty()
    @ApiProperty({
        description: 'Descripción del proyecto',
        example: 'Proyecto de construcción'
    })
    descripcion: string;
  
    @IsDate()
    @IsNotEmpty()
    @ApiProperty({
        description: 'Fecha de inicio del proyecto',
        example: '2021-01-01'
    })
    fechaInicio: Date;
  
    @IsDate()
    @IsNotEmpty()
    @ApiProperty({
        description: 'Fecha de fin del proyecto',
        example: '2021-01-01'
    })
    fechaFin: Date;
  
    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        description: 'Estado del proyecto',
        example: 'En progreso'
    })
    estado: string;
  
    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        description: 'Presupuesto del proyecto',
        example: '1000000'
    })
    presupuesto: string;
  
    
}
