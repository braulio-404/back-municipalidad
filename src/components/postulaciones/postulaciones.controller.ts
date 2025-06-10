import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { PostulacionesService } from './postulaciones.service';
import { CreatePostulacionDto } from './dto/create-postulacion.dto';
import { UpdatePostulacionDto } from './dto/update-postulacion.dto';

@Controller('postulaciones')
export class PostulacionesController {
  constructor(private readonly postulacionesService: PostulacionesService) {}

  @Post()
  create(@Body() createPostulacionDto: CreatePostulacionDto) {
    return this.postulacionesService.create(createPostulacionDto);
  }

  @Get()
  findAll(@Query('titulo') titulo?: string, @Query('estado') estado?: 'activa' | 'vencida') {
    if (titulo || estado) {
      return this.postulacionesService.filtrarPostulaciones({ titulo, estado });
    }
    return this.postulacionesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postulacionesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePostulacionDto: UpdatePostulacionDto) {
    return this.postulacionesService.update(+id, updatePostulacionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.postulacionesService.remove(+id);
  }
} 