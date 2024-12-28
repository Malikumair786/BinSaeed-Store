import { MigrationInterface, QueryRunner } from "typeorm";

export class NewMigrations1735396183883 implements MigrationInterface {
    name = 'NewMigrations1735396183883'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`users\` (\`id\` int NOT NULL AUTO_INCREMENT, \`userName\` varchar(50) NOT NULL, \`phoneNumber\` varchar(255) NOT NULL, \`address\` varchar(255) NOT NULL, \`email\` varchar(255) NOT NULL, \`isVerified\` tinyint NOT NULL DEFAULT 0, \`password\` varchar(255) NOT NULL, \`role\` enum ('admin', 'user') NOT NULL DEFAULT 'user', \`loggedInWith\` enum ('email', 'google', 'facebook') NULL DEFAULT 'email', \`apiKey\` varchar(255) NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, UNIQUE INDEX \`IDX_97672ac88f789774dd47f7c8be\` (\`email\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`link\` (\`id\` varchar(36) NOT NULL, \`link\` varchar(255) NOT NULL, \`expiry\` datetime NOT NULL, \`userId\` int NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, \`openCount\` int NOT NULL DEFAULT '0', \`token\` varchar(255) NOT NULL, UNIQUE INDEX \`IDX_afacfe144a986300891fab3521\` (\`token\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`IDX_afacfe144a986300891fab3521\` ON \`link\``);
        await queryRunner.query(`DROP TABLE \`link\``);
        await queryRunner.query(`DROP INDEX \`IDX_97672ac88f789774dd47f7c8be\` ON \`users\``);
        await queryRunner.query(`DROP TABLE \`users\``);
    }

}
