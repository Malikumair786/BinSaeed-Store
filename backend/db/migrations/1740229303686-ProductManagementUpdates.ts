import { MigrationInterface, QueryRunner } from "typeorm";

export class ProductManagementUpdates1740229303686 implements MigrationInterface {
    name = 'ProductManagementUpdates1740229303686'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`products\` ADD \`images\` text NULL`);
        await queryRunner.query(`ALTER TABLE \`products\` ADD \`tags\` text NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`products\` DROP COLUMN \`tags\``);
        await queryRunner.query(`ALTER TABLE \`products\` DROP COLUMN \`images\``);
    }

}
