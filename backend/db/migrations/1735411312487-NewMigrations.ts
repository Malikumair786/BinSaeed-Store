import { MigrationInterface, QueryRunner } from "typeorm";

export class NewMigrations1735411312487 implements MigrationInterface {
    name = 'NewMigrations1735411312487'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`userName\``);
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`phoneNumber\``);
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`username\` varchar(50) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`phoneNo\` varchar(255) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`phoneNo\``);
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`username\``);
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`phoneNumber\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`userName\` varchar(50) NOT NULL`);
    }

}
