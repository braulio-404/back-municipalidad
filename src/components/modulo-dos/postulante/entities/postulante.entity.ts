import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { DocumentoPostulante } from '../../documento-postulante/entities/documento-postulante.entity';
import { Formulario } from '../../../formularios/entities/formulario.entity';

@Entity()
export class Postulante {
    @PrimaryGeneratedColumn('uuid')
    postulanteID: string;

    @Column({ type: 'varchar', length: 100 })
    nombres: string;

    @Column({ type: 'varchar', length: 100 })
    apellidoPaterno: string;

    @Column({ type: 'varchar', length: 12, unique: true })
    rut: string;

    @Column({ type: 'varchar', length: 100, unique: true })
    email: string;

    @Column({ type: 'varchar', length: 20, nullable: true })
    telefono: string;

    @CreateDateColumn()
    fechaRegistro: Date;

    // Relaciones
    @OneToMany(() => DocumentoPostulante, (documento) => documento.postulante)
    documentos: DocumentoPostulante[];

    @ManyToOne(() => Formulario, { nullable: false })
    @JoinColumn({ name: 'formulario_id' })
    formulario: Formulario;

    @Column({ type: 'int' })
    formulario_id: number;
}
