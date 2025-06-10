import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateEmpresaDto {
    @IsNotEmpty()
    @IsString()
    @ApiProperty({
        description: 'Razón social de la empresa',
        example: 'Empresa S.A.'
    })
  razonSocial: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'RUT de la empresa',
    example: '12345678-9'
  })
  rutEmpresa: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'Región de la empresa',
    example: 'Metropolitana'
  })
  region: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'Comuna de la empresa',
    example: 'Santiago'
  })
  comuna: string;

  @IsNotEmpty() 
  @IsString()
  @ApiProperty({
    description: 'Dirección de la empresa',
    example: 'Av. Siempre Viva 123'
  })
  direccion: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'Teléfono de la empresa',
    example: '+56912345678'
  })
  telefono: string;

  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'Rubro de la empresa',
    example: 'Construcción'
  })
  rubro: string;

  @IsNotEmpty()
  sitioWeb: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'Representante legal de la empresa',
    example: 'Juan Pérez'
  })
  representanteLegal: string;

  @IsNotEmpty()
  representanteLegalRut: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'Teléfono del representante legal',
    example: '+56912345678'
  })
  representanteLegalTelefono: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'Email del representante legal',
    example: 'juan.perez@empresa.com'
  })
  representanteLegalEmail: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'Cargo del representante legal',
    example: 'Gerente'
  })
  representanteLegalCargo: string;

}
