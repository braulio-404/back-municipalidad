import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RequisitosService } from './requisitos.service';
import { RequisitosController } from './requisitos.controller';
import { Requisito } from './entities/requisito.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Requisito])],
  controllers: [RequisitosController],
  providers: [RequisitosService],
  exports: [RequisitosService]
})
export class RequisitosModule {} 