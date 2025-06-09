import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { ProyectoEmpresa } from '../../proyecto-empresa/entities/proyecto-empresa.entity';
import { DocumentoEmpresa } from '../../documento-empresa/entities/documento-empresa.entity';

@Entity()
export class Empresa {
  @PrimaryGeneratedColumn('uuid')
  empresaID: string;

  @Column()
  razonSocial: string;

  @Column()
  rutEmpresa: string;

  @Column()
  region: string;

  @Column()
  comuna: string;

  @Column()
  direccion: string;

  @Column()
  telefono: string;

  @Column()
  email: string;

  @Column()
  rubro: string;

  @Column()
  sitioWeb: string;

  @Column()
  representanteLegal: string;

  @Column()
  representanteLegalRut: string;

  @Column()
  representanteLegalTelefono: string;

  @Column()
  representanteLegalEmail: string;

  @Column()
  representanteLegalCargo: string;

  







  @OneToMany(() => ProyectoEmpresa, (proyectoEmpresa) => proyectoEmpresa.empresa)
  proyectos: ProyectoEmpresa[];

  @OneToMany(() => DocumentoEmpresa, (documento) => documento.empresa)
  documentos: DocumentoEmpresa[];
}
