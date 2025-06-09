import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { OfertaTrabajo } from '../../oferta-trabajo/entities/oferta-trabajo.entity';
import { Postulante } from '../../postulante/entities/postulante.entity';

@Entity()
export class OfertaPostulante {
    @PrimaryColumn()
    ofertaTrabajoID: string;

    @PrimaryColumn()
    postulanteID: string;

    @Column({ type: 'date' })
    fechaPostulacion: Date;

    @Column({ type: 'enum', enum: ['pendiente', 'en_revision', 'preseleccionado', 'entrevista', 'contratado', 'rechazado'], default: 'pendiente' })
    estado: string;

    @Column({ type: 'text', nullable: true })
    cartaPresentacion: string;

    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
    pretensionSalarial: number;

    @Column({ type: 'varchar', length: 100, nullable: true })
    disponibilidadInicio: string; // inmediata, 1 semana, 2 semanas, 1 mes

    @Column({ type: 'text', nullable: true })
    observacionesRRHH: string;

    @Column({ type: 'date', nullable: true })
    fechaEntrevista: Date;

    @Column({ type: 'varchar', length: 100, nullable: true })
    tipoEntrevista: string; // presencial, online, telefónica

    @Column({ type: 'text', nullable: true })
    comentarios: string;

    @Column({ type: 'int', nullable: true })
    puntuacion: number; // 1-10

    // Relaciones
    @ManyToOne(() => OfertaTrabajo, (ofertaTrabajo) => ofertaTrabajo.postulantes)
    @JoinColumn({ name: 'ofertaTrabajoID', referencedColumnName: 'ofertaTrabajoID' })
    ofertaTrabajo: OfertaTrabajo;

    @ManyToOne(() => Postulante)
    @JoinColumn({ name: 'postulanteID', referencedColumnName: 'postulanteID' })
    postulante: Postulante;
}
