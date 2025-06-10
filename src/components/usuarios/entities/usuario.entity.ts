import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class Usuario {
    @PrimaryGeneratedColumn('uuid')
    usuarioID: string;

    @Column({ type: 'varchar', length: 100 })
    nombre: string;
    
    @Column({ type: 'varchar', length: 100, unique: true })
    email: string;

    @Column({ type: 'varchar', length: 255 })
    password: string;

    @Column({ 
        type: 'enum', 
        enum: ['admin', 'rrhh', 'supervisor', 'usuario'], 
        default: 'usuario' 
    })
    rol: string;

    @Column({ 
        type: 'enum', 
        enum: ['activo', 'inactivo', 'bloqueado'], 
        default: 'activo' 
    })
    estado: string;

    @CreateDateColumn()
    fechaCreacion: Date;

    @UpdateDateColumn()
    fechaActualizacion: Date;

    @Column({ type: 'timestamp', nullable: true })
    ultimoLogin: Date;
}
