import { IsArray, IsNumber } from 'class-validator';

export class DescargarDocumentosDto {
    @IsArray()
    @IsNumber({}, { each: true })
    ids: number[];
} 