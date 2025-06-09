import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProyectoEmpresaService } from './proyecto-empresa.service';
import { ProyectoEmpresaController } from './proyecto-empresa.controller';
import { ProyectoEmpresa } from './entities/proyecto-empresa.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ProyectoEmpresa])],
  controllers: [ProyectoEmpresaController],
  providers: [ProyectoEmpresaService],
  exports: [ProyectoEmpresaService, TypeOrmModule],
})
export class ProyectoEmpresaModule {}
