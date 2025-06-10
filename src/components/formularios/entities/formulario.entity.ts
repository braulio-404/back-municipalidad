import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToMany, JoinTable, OneToMany } from "typeorm";
import { Requisito } from "../../requisitos/entities/requisito.entity";
import { Postulante } from "../../modulo-dos/postulante/entities/postulante.entity";

@Entity('formularios')
export class Formulario {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 255 })
    cargo: string;

    @Column({ type: 'text', nullable: true })
    descripcion: string | null;

    @Column({ type: 'text', nullable: true })
    requisitos: string | null;

    @Column({ type: 'timestamp' })
    fechaInicio: Date;

    @Column({ type: 'timestamp' })
    fechaTermino: Date;

    @Column({ 
        type: 'enum', 
        enum: ['Activo', 'Inactivo'],
        default: 'Activo'
    })
    estado: 'Activo' | 'Inactivo';

    @ManyToMany(() => Requisito)
    @JoinTable({
        name: 'formulario_requisitos',
        joinColumn: {
            name: 'formulario_id',
            referencedColumnName: 'id'
        },
        inverseJoinColumn: {
            name: 'requisito_id',
            referencedColumnName: 'id'
        }
    })
    requisitosSeleccionados: Requisito[];

    // Relación con postulantes
    @OneToMany(() => Postulante, (postulante) => postulante.formulario)
    postulantes: Postulante[];

    @CreateDateColumn()
    fechaCreacion: Date;

    @UpdateDateColumn()
    fechaActualizacion: Date;
} 