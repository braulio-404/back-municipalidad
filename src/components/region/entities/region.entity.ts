import { Column, Entity, OneToMany, PrimaryColumn } from "typeorm";
import { Comuna } from "../../comuna/entities/comuna.entity";

@Entity()
export class Region {
    @PrimaryColumn()
    regionId:number

    @Column()
    nombre:string

    @OneToMany(() => Comuna, (comuna) => comuna.region)
    comunas: Comuna[]
}
