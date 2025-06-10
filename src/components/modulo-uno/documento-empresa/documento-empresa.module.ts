import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DocumentoEmpresaService } from './documento-empresa.service';
import { DocumentoEmpresaController } from './documento-empresa.controller';
import { DocumentoEmpresa } from './entities/documento-empresa.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DocumentoEmpresa])],
  controllers: [DocumentoEmpresaController],
  providers: [DocumentoEmpresaService],
  exports: [DocumentoEmpresaService, TypeOrmModule],
})
export class DocumentoEmpresaModule {}
