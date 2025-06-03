import { MigrationInterface, QueryRunner } from "typeorm";

export class CorrectCompanyPurchaseRelations1748898534705 implements MigrationInterface {
    name = 'CorrectCompanyPurchaseRelations1748898534705'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "addresses" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "street" character varying NOT NULL, "number" character varying NOT NULL, "complement" character varying, "neighborhood" character varying NOT NULL, "city" character varying NOT NULL, "state" character varying NOT NULL, "zip_code" character varying NOT NULL, "is_main" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "company_id" uuid, CONSTRAINT "PK_745d8f43d3af10ab8247465e450" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."purchases_status_enum" AS ENUM('pending', 'approved', 'denied', 'cancelled', 'completed')`);
        await queryRunner.query(`CREATE TABLE "purchases" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "quantity" numeric(10,2) NOT NULL, "unit_price" numeric(10,2) NOT NULL, "total_value" numeric(10,2) NOT NULL, "status" "public"."purchases_status_enum" NOT NULL DEFAULT 'pending', "denial_reason" character varying, "cancellation_reason" character varying, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "buyer_id" uuid, "seller_id" uuid, "material_id" uuid, CONSTRAINT "PK_1d55032f37a34c6eceacbbca6b8" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "materials" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "category" character varying, "description" text NOT NULL, "price" numeric(10,2) NOT NULL, "quantity" numeric(10,2) NOT NULL, "unit" character varying NOT NULL, "is_active" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "company_id" uuid, CONSTRAINT "PK_2fd1a93ecb222a28bef28663fa0" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "companies" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(100) NOT NULL, "cnpj" character varying NOT NULL, "email" character varying NOT NULL, "phone" character varying NOT NULL, "description" text NOT NULL, "password" character varying NOT NULL, "role" character varying NOT NULL DEFAULT 'user', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_703760d095b8e399e34950f4960" UNIQUE ("cnpj"), CONSTRAINT "UQ_d0af6f5866201d5cb424767744a" UNIQUE ("email"), CONSTRAINT "PK_d4bc3e82a314fa9e29f652c2c22" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."sales_status_enum" AS ENUM('pending', 'approved', 'rejected', 'completed', 'cancelled')`);
        await queryRunner.query(`CREATE TABLE "sales" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "contract_number" character varying NOT NULL, "quantity" numeric(10,2) NOT NULL, "unit_price" numeric(10,2) NOT NULL, "total_value" numeric(10,2) NOT NULL, "status" "public"."sales_status_enum" NOT NULL DEFAULT 'pending', "sale_date" date NOT NULL, "delivery_date" date, "payment_date" date, "notes" text, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "company_id" uuid, "material_id" uuid, CONSTRAINT "PK_4f0bc990ae81dba46da680895ea" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "addresses" ADD CONSTRAINT "FK_21b07f425d667f94949fcc07914" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "purchases" ADD CONSTRAINT "FK_a3886ad6e415bce0b2f25c136bc" FOREIGN KEY ("buyer_id") REFERENCES "companies"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "purchases" ADD CONSTRAINT "FK_f301deca5d711b59d71038bf44b" FOREIGN KEY ("seller_id") REFERENCES "companies"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "purchases" ADD CONSTRAINT "FK_245dc3b196fedcd80a7df5209eb" FOREIGN KEY ("material_id") REFERENCES "materials"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "materials" ADD CONSTRAINT "FK_d428775a3fe92626ec53f47bb17" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "sales" ADD CONSTRAINT "FK_6126ce1093dd7ed2d023c47633c" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "sales" ADD CONSTRAINT "FK_78d6c35ee95ef925b6806dc1e1d" FOREIGN KEY ("material_id") REFERENCES "materials"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sales" DROP CONSTRAINT "FK_78d6c35ee95ef925b6806dc1e1d"`);
        await queryRunner.query(`ALTER TABLE "sales" DROP CONSTRAINT "FK_6126ce1093dd7ed2d023c47633c"`);
        await queryRunner.query(`ALTER TABLE "materials" DROP CONSTRAINT "FK_d428775a3fe92626ec53f47bb17"`);
        await queryRunner.query(`ALTER TABLE "purchases" DROP CONSTRAINT "FK_245dc3b196fedcd80a7df5209eb"`);
        await queryRunner.query(`ALTER TABLE "purchases" DROP CONSTRAINT "FK_f301deca5d711b59d71038bf44b"`);
        await queryRunner.query(`ALTER TABLE "purchases" DROP CONSTRAINT "FK_a3886ad6e415bce0b2f25c136bc"`);
        await queryRunner.query(`ALTER TABLE "addresses" DROP CONSTRAINT "FK_21b07f425d667f94949fcc07914"`);
        await queryRunner.query(`DROP TABLE "sales"`);
        await queryRunner.query(`DROP TYPE "public"."sales_status_enum"`);
        await queryRunner.query(`DROP TABLE "companies"`);
        await queryRunner.query(`DROP TABLE "materials"`);
        await queryRunner.query(`DROP TABLE "purchases"`);
        await queryRunner.query(`DROP TYPE "public"."purchases_status_enum"`);
        await queryRunner.query(`DROP TABLE "addresses"`);
    }

}
