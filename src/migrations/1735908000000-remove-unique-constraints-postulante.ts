import { MigrationInterface, QueryRunner } from "typeorm";

export class RemoveUniqueConstraintsPostulante1735908000000 implements MigrationInterface {
    name = 'RemoveUniqueConstraintsPostulante1735908000000';

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Remover restricción de unicidad del RUT
        await queryRunner.query(`ALTER TABLE "postulante" DROP CONSTRAINT IF EXISTS "UQ_42eb4120b2da37af13e399a976f"`);
        
        // Remover restricción de unicidad del email  
        await queryRunner.query(`ALTER TABLE "postulante" DROP CONSTRAINT IF EXISTS "UQ_6e9f1a28b8b34de7893e2ad2ac6"`);
        
        // Remover cualquier otra restricción de unicidad que pueda existir en RUT
        await queryRunner.query(`DROP INDEX IF EXISTS "IDX_42eb4120b2da37af13e399a976"`);
        
        // Remover cualquier otra restricción de unicidad que pueda existir en email
        await queryRunner.query(`DROP INDEX IF EXISTS "IDX_6e9f1a28b8b34de7893e2ad2ac"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Restaurar restricción de unicidad del email
        await queryRunner.query(`ALTER TABLE "postulante" ADD CONSTRAINT "UQ_6e9f1a28b8b34de7893e2ad2ac6" UNIQUE ("email")`);
        
        // Restaurar restricción de unicidad del RUT
        await queryRunner.query(`ALTER TABLE "postulante" ADD CONSTRAINT "UQ_42eb4120b2da37af13e399a976f" UNIQUE ("rut")`);
    }
} 