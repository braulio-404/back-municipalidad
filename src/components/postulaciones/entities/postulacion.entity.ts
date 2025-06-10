import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity('postulaciones')
export class Postulacion {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 255 })
    titulo: string;

    @Column({ type: 'text' })
    descripcion: string;

    @CreateDateColumn()
    fechaCreacion: Date;

    @Column({ type: 'timestamp' })
    fechaVencimiento: Date;

    @Column({ 
        type: 'enum', 
        enum: ['activa', 'vencida'],
        default: 'activa'
    })
    estado: 'activa' | 'vencida';

    @UpdateDateColumn()
    fechaActualizacion: Date;
} 