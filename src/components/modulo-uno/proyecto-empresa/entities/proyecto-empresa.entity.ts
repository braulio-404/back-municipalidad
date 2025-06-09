import { Column, Entity, PrimaryColumn, ManyToOne, JoinColumn, CreateDateColumn } from "typeorm";
import { Proyecto } from "../../proyecto/entities/proyecto.entity";
import { Empresa } from "../../empresa/entities/empresa.entity";

@Entity()
export class ProyectoEmpresa {

    @PrimaryColumn()
    proyectoID: string;

    @PrimaryColumn()
    empresaID: string;

    @Column({ type: 'text', nullable: true })
    observaciones: string;

    @ManyToOne(() => Proyecto, (proyecto) => proyecto.proyectoEmpresa)
    @JoinColumn({ name: 'proyectoID' })
    proyecto: Proyecto;

    @ManyToOne(() => Empresa, (empresa) => empresa.proyectos)
    @JoinColumn({ name: 'empresaID' })
    empresa: Empresa;
}
