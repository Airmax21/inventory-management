import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1757438615480 implements MigrationInterface {
    name = 'Init1757438615480'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "username" citext NOT NULL, "email" citext NOT NULL, "password" text NOT NULL, "name" citext NOT NULL, "role" "public"."users_role_enum" NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "UQ_user_name" ON "users" ("username", "email") WHERE (deleted_at IS NULL)`);
        await queryRunner.query(`CREATE TABLE "masters" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" citext NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "category_id" uuid NOT NULL, "deleted_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_ffb63641dda57195f6e23dc4c0d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "UQ_master_name" ON "masters" ("name") WHERE (deleted_at IS NULL)`);
        await queryRunner.query(`CREATE TABLE "items" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "master_id" uuid NOT NULL, "location_id" uuid NOT NULL, "stock" integer NOT NULL, "exp_date" TIMESTAMP WITH TIME ZONE, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_ba5885359424c15ca6b9e79bcf6" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "category" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" citext NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_9c4e4a89e3674fc9f382d733f03" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "UQ_category_name" ON "category" ("name") WHERE (deleted_at IS NULL)`);
        await queryRunner.query(`CREATE TABLE "locations" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" citext NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_7cc1c9e3853b94816c094825e74" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "UQ_location_name" ON "locations" ("name") WHERE (deleted_at IS NULL)`);
        await queryRunner.query(`CREATE TABLE "transactions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "src_item_id" uuid NOT NULL, "dst_location_id" uuid NOT NULL, "qty" integer NOT NULL, "status" "public"."transactions_status_enum", "approve_at" TIMESTAMP WITH TIME ZONE, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_a219afd8dd77ed80f5a862f1db9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "masters" ADD CONSTRAINT "FK_masters_category" FOREIGN KEY ("category_id") REFERENCES "category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "items" ADD CONSTRAINT "FK_items_masters" FOREIGN KEY ("master_id") REFERENCES "masters"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "items" ADD CONSTRAINT "FK_items_locations" FOREIGN KEY ("location_id") REFERENCES "locations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "transactions" ADD CONSTRAINT "FK_items_transactions" FOREIGN KEY ("src_item_id") REFERENCES "items"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "transactions" ADD CONSTRAINT "FK_locations_transactions" FOREIGN KEY ("dst_location_id") REFERENCES "locations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transactions" DROP CONSTRAINT "FK_locations_transactions"`);
        await queryRunner.query(`ALTER TABLE "transactions" DROP CONSTRAINT "FK_items_transactions"`);
        await queryRunner.query(`ALTER TABLE "items" DROP CONSTRAINT "FK_items_locations"`);
        await queryRunner.query(`ALTER TABLE "items" DROP CONSTRAINT "FK_items_masters"`);
        await queryRunner.query(`ALTER TABLE "masters" DROP CONSTRAINT "FK_masters_category"`);
        await queryRunner.query(`DROP TABLE "transactions"`);
        await queryRunner.query(`DROP INDEX "public"."UQ_location_name"`);
        await queryRunner.query(`DROP TABLE "locations"`);
        await queryRunner.query(`DROP INDEX "public"."UQ_category_name"`);
        await queryRunner.query(`DROP TABLE "category"`);
        await queryRunner.query(`DROP TABLE "items"`);
        await queryRunner.query(`DROP INDEX "public"."UQ_master_name"`);
        await queryRunner.query(`DROP TABLE "masters"`);
        await queryRunner.query(`DROP INDEX "public"."UQ_user_name"`);
        await queryRunner.query(`DROP TABLE "users"`);
    }

}
