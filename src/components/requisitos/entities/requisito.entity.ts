import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity('requisitos')
export class Requisito {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 255 })
    nombre: string;

    @Column({ type: 'text', nullable: true })
    descripcion?: string;

    @Column({ 
        type: 'enum', 
        enum: ['documento', 'certificado', 'titulo', 'experiencia', 'otro'],
        default: 'documento'
    })
    tipo: 'documento' | 'certificado' | 'titulo' | 'experiencia' | 'otro';

    @Column({ type: 'boolean', default: true })
    obligatorio: boolean;

    @Column({ type: 'boolean', default: true })
    activo: boolean;

    @CreateDateColumn()
    fechaCreacion: Date;

    @UpdateDateColumn()
    fechaModificacion?: Date;
} 