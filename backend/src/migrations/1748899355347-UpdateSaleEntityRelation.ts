import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateSaleEntityRelation1748899355347 implements MigrationInterface {
    name = 'UpdateSaleEntityRelation1748899355347'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sales" DROP CONSTRAINT "FK_6126ce1093dd7ed2d023c47633c"`);
        await queryRunner.query(`ALTER TABLE "sales" RENAME COLUMN "company_id" TO "seller_id"`);
        await queryRunner.query(`ALTER TABLE "sales" ADD CONSTRAINT "FK_fbcb737b3ecc7c968b0dc167122" FOREIGN KEY ("seller_id") REFERENCES "companies"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sales" DROP CONSTRAINT "FK_fbcb737b3ecc7c968b0dc167122"`);
        await queryRunner.query(`ALTER TABLE "sales" RENAME COLUMN "seller_id" TO "company_id"`);
        await queryRunner.query(`ALTER TABLE "sales" ADD CONSTRAINT "FK_6126ce1093dd7ed2d023c47633c" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
