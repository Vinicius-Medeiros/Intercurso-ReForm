import { MigrationInterface, QueryRunner } from "typeorm";

export class AddPurchaseFieldsToSales1710000000000 implements MigrationInterface {
    name = 'AddPurchaseFieldsToSales1710000000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sales" ALTER COLUMN "sale_date" TYPE TIMESTAMP USING sale_date::timestamp`);
        
        await queryRunner.query(`ALTER TABLE "sales" ADD "purchase_id" uuid`);
        await queryRunner.query(`ALTER TABLE "sales" ADD "reason" text`);
        await queryRunner.query(`ALTER TABLE "sales" ADD "status_change_date" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "sales" ADD CONSTRAINT "FK_sales_purchase" FOREIGN KEY ("purchase_id") REFERENCES "purchases"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sales" DROP CONSTRAINT "FK_sales_purchase"`);
        await queryRunner.query(`ALTER TABLE "sales" DROP COLUMN "status_change_date"`);
        await queryRunner.query(`ALTER TABLE "sales" DROP COLUMN "reason"`);
        await queryRunner.query(`ALTER TABLE "sales" DROP COLUMN "purchase_id"`);
        await queryRunner.query(`ALTER TABLE "sales" ALTER COLUMN "sale_date" TYPE date USING sale_date::date`);
    }
} 