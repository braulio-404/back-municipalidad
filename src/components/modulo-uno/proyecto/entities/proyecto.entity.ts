import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { ProyectoEmpresa } from "../../proyecto-empresa/entities/proyecto-empresa.entity";

@Entity()
export class Proyecto {
  @PrimaryGeneratedColumn('uuid')
  proyectoID: string;

  @Column()
  titulo: string;

  @Column()
  descripcion: string;

  @Column()
  fechaInicio: Date;

  @Column()
  fechaFin: Date;

  @Column()
  estado: string;

  @Column({nullable: true})
  presupuesto: string;


  @OneToMany(() => ProyectoEmpresa, (proyectoEmpresa) => proyectoEmpresa.proyecto)
  proyectoEmpresa: ProyectoEmpresa[];

 
}
