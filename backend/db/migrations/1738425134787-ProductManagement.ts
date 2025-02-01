import { MigrationInterface, QueryRunner } from "typeorm";

export class ProductManagement1738425134787 implements MigrationInterface {
    name = 'ProductManagement1738425134787'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`product_variants\` (\`id\` int NOT NULL AUTO_INCREMENT, \`variant_name\` varchar(255) NOT NULL, \`price\` decimal(10,2) NULL, \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` timestamp(6) NULL, \`productId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`product_images\` (\`id\` int NOT NULL AUTO_INCREMENT, \`image_url\` varchar(255) NOT NULL, \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` timestamp(6) NULL, \`productId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`products\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` text NOT NULL, \`description\` text NOT NULL, \`price\` decimal(10,2) NOT NULL, \`image_url\` varchar(255) NULL, \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` timestamp(6) NULL, \`categoryId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`product_tags\` (\`id\` int NOT NULL AUTO_INCREMENT, \`tag\` varchar(255) NOT NULL, \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` timestamp(6) NULL, \`productId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`product_variants\` ADD CONSTRAINT \`FK_f515690c571a03400a9876600b5\` FOREIGN KEY (\`productId\`) REFERENCES \`products\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`product_images\` ADD CONSTRAINT \`FK_b367708bf720c8dd62fc6833161\` FOREIGN KEY (\`productId\`) REFERENCES \`products\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`products\` ADD CONSTRAINT \`FK_ff56834e735fa78a15d0cf21926\` FOREIGN KEY (\`categoryId\`) REFERENCES \`categories\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`product_tags\` ADD CONSTRAINT \`FK_d11be11255b8eeb5d761023e6bc\` FOREIGN KEY (\`productId\`) REFERENCES \`products\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`product_tags\` DROP FOREIGN KEY \`FK_d11be11255b8eeb5d761023e6bc\``);
        await queryRunner.query(`ALTER TABLE \`products\` DROP FOREIGN KEY \`FK_ff56834e735fa78a15d0cf21926\``);
        await queryRunner.query(`ALTER TABLE \`product_images\` DROP FOREIGN KEY \`FK_b367708bf720c8dd62fc6833161\``);
        await queryRunner.query(`ALTER TABLE \`product_variants\` DROP FOREIGN KEY \`FK_f515690c571a03400a9876600b5\``);
        await queryRunner.query(`DROP TABLE \`product_tags\``);
        await queryRunner.query(`DROP TABLE \`products\``);
        await queryRunner.query(`DROP TABLE \`product_images\``);
        await queryRunner.query(`DROP TABLE \`product_variants\``);
    }

}
