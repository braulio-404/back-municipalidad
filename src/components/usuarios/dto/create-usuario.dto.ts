import { IsString, IsEmail, IsNotEmpty, IsEnum, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUsuarioDto {
    @ApiProperty({ description: 'Nombre completo del usuario' })
    @IsString()
    @IsNotEmpty()
    nombre: string;

    @ApiProperty({ description: 'Email único del usuario' })
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty({ description: 'Contraseña del usuario' })
    @IsString()
    @IsNotEmpty()
    password: string;

    @ApiProperty({ 
        description: 'Rol del usuario', 
        enum: ['admin', 'rrhh', 'supervisor', 'usuario'],
        default: 'usuario',
        required: false 
    })
    @IsEnum(['admin', 'rrhh', 'supervisor', 'usuario'])
    @IsOptional()
    rol?: string;

    @ApiProperty({ 
        description: 'Estado del usuario', 
        enum: ['activo', 'inactivo', 'bloqueado'],
        default: 'activo',
        required: false 
    })
    @IsEnum(['activo', 'inactivo', 'bloqueado'])
    @IsOptional()
    estado?: string;
}
