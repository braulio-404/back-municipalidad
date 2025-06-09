import { IsEmail, IsNotEmpty, IsString, MinLength, IsEnum, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
    @ApiProperty({ description: 'Nombre completo del usuario' })
    @IsString()
    @IsNotEmpty()
    nombre: string;

    @ApiProperty({ description: 'Email único del usuario' })
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty({ description: 'Contraseña (mínimo 6 caracteres)' })
    @IsString()
    @IsNotEmpty()
    @MinLength(6)
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
} 