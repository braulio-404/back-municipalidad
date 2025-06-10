import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Postulante } from '../../postulante/entities/postulante.entity';

@Entity()
export class DocumentoPostulante {
    @PrimaryGeneratedColumn('uuid')
    documentoPostulanteID: string;

    @Column()
    postulanteID: string;

    @Column({ type: 'varchar', length: 255 })
    nombreArchivo: string;

    @Column({ type: 'varchar', length: 50 })
    tipoArchivo: string;

    @Column({ type: 'text', nullable: true })
    descripcion: string;

    @Column({ type: 'text', nullable: true })
    contenido: string;

    @CreateDateColumn()
    fechaSubida: Date;

    // Relación con Postulante
    @ManyToOne(() => Postulante, (postulante) => postulante.documentos)
    @JoinColumn({ name: 'postulanteID', referencedColumnName: 'postulanteID' })
    postulante: Postulante;
}
