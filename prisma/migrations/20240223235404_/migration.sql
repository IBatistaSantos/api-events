/*
  Warnings:

  - You are about to drop the `additional_fields` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `options` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "additional_fields" DROP CONSTRAINT "additional_fields_form_id_fkey";

-- DropForeignKey
ALTER TABLE "additional_fields" DROP CONSTRAINT "additional_fields_option_id_fkey";

-- DropForeignKey
ALTER TABLE "options" DROP CONSTRAINT "options_field_id_fkey";

-- AlterTable
ALTER TABLE "fields" ADD COLUMN     "Options" JSONB[];

-- DropTable
DROP TABLE "additional_fields";

-- DropTable
DROP TABLE "options";
