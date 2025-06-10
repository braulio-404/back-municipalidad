import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsuariosModule } from './components/usuarios/usuarios.module';
import { ComunaModule } from './components/comuna/comuna.module';
import { RegionModule } from './components/region/region.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { databaseConfig } from './config/database.config';
import { DatabaseModule } from './database/database.module';
import { ProyectoModule } from './components/modulo-uno/proyecto/proyecto.module';
import { ProyectoEmpresaModule } from './components/modulo-uno/proyecto-empresa/proyecto-empresa.module';
import { AuthModule } from './auth/auth.module';
import { PostulanteModule } from './components/modulo-dos/postulante/postulante.module';
import { PostulacionesModule } from './components/postulaciones/postulaciones.module';
import { RequisitosModule } from './components/requisitos/requisitos.module';
import { FormulariosModule } from './components/formularios/formularios.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig],
    }),
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => configService.get('database'),
      inject: [ConfigService],
    }),
    DatabaseModule,
    AuthModule,
    UsuariosModule,
    ComunaModule,
    RegionModule,
    ProyectoModule,
    ProyectoEmpresaModule,
    PostulanteModule,
    PostulacionesModule,
    RequisitosModule,
    FormulariosModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
