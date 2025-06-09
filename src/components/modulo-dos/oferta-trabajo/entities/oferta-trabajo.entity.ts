import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn } from 'typeorm';
import { OfertaPostulante } from '../../oferta-postulante/entities/oferta-postulante.entity';

@Entity()
export class OfertaTrabajo {
    @PrimaryGeneratedColumn('uuid')
    ofertaTrabajoID: string;

    @Column({ type: 'varchar', length: 255 })
    tituloOferta: string;

    @Column({ type: 'text' })
    descripcion: string;


    @Column({ type: 'varchar', length: 100 })
    ubicacion: string;

    @Column({ type: 'varchar', length: 100 })
    modalidad: string; // presencial, remoto, híbrido

    @Column({ type: 'varchar', length: 100 })
    tipoContrato: string; // full-time, part-time, temporal, por proyecto

    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
    salarioMinimo: number;

    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
    salarioMaximo: number;

    @Column({ type: 'text', nullable: true })
    requisitos: string;

    @Column({ type: 'text', nullable: true })
    beneficios: string;

    @Column({ type: 'varchar', length: 100, nullable: true })
    experienciaRequerida: string; // junior, semi-senior, senior

    @Column({ type: 'varchar', length: 100, nullable: true })
    nivelEducacion: string; // técnico, universitario, postgrado

    @Column()
    fechaPublicacion: Date;

    @Column()
    fechaCierre: Date;

    @Column({ type: 'enum', enum: ['activa', 'cerrada', 'pausada', 'finalizada'], default: 'activa' })
    estado: string;

    @Column({ type: 'varchar', length: 100, nullable: true })
    contactoRRHH: string;

    @Column({ type: 'varchar', length: 100, nullable: true })
    emailContacto: string;

    @Column({ type: 'varchar', length: 20, nullable: true })
    telefonoContacto: string;

    @Column({ type: 'int', default: 0 })
    numeroVacantes: number;

    @Column({ type: 'varchar', length: 100, nullable: true })
    jornada: string; 

    @CreateDateColumn()
    fechaCreacion: Date;

    @OneToMany(() => OfertaPostulante, (ofertaPostulante) => ofertaPostulante.ofertaTrabajo)
    postulantes: OfertaPostulante[];
}
