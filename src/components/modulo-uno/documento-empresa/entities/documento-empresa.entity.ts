import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Empresa } from '../../empresa/entities/empresa.entity';

@Entity()
export class DocumentoEmpresa {
    @PrimaryGeneratedColumn('uuid')
    documentoEmpresaID: string;

    @Column()
    empresaID: string;

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

    // Relación con Empresa
    @ManyToOne(() => Empresa, (empresa) => empresa.documentos)
    @JoinColumn({ name: 'empresaID' })
    empresa: Empresa;
}
