import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Region } from '../components/region/entities/region.entity';
import { Comuna } from '../components/comuna/entities/comuna.entity';
import { SeedService } from './seeds/seed.service';

@Module({
  imports: [TypeOrmModule.forFeature([Region, Comuna])],
  providers: [SeedService],
  exports: [SeedService],
})
export class DatabaseModule {} 