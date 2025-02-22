import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangeVariantNameToName1740233763774 implements MigrationInterface {
    name = 'ChangeVariantNameToName1740233763774'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`product_variants\` CHANGE \`variant_name\` \`name\` varchar(255) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`product_variants\` CHANGE \`name\` \`variant_name\` varchar(255) NOT NULL`);
    }
}
