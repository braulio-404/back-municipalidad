import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ComunaService } from './comuna.service';
import { ComunaController } from './comuna.controller';
import { Comuna } from './entities/comuna.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Comuna])],
  controllers: [ComunaController],
  providers: [ComunaService],
  exports: [TypeOrmModule],
})
export class ComunaModule {}
