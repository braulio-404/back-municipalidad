import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RegionService } from './region.service';
import { Public } from '../../common/decorators/public.decorator';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller('region')
@ApiTags('Region')
@Public()
export class RegionController {
  constructor(private readonly regionService: RegionService) {}


  @Get()
  @ApiOperation({ summary: 'Obtener todas las regiones' })
  findAll() {
    return this.regionService.findAll();
  }

  @Get(':regionId')
  @ApiOperation({ summary: 'Obtener una region por su ID' })
  findOne(@Param('regionId') regionId: number) {
    return this.regionService.findOne(regionId);
  }

}
