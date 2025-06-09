import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn, Table } from "typeorm";
import { Region } from "../../region/entities/region.entity";


@Entity()
export class Comuna {
    @PrimaryColumn()
    comunaId:number

    @Column()
    nombre:string

    @Column()
    regionId:number

    @ManyToOne(() => Region, (region) => region.comunas)
    @JoinColumn({ name: 'regionId' })
    region: Region;
}
