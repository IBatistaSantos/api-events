/*
  Warnings:

  - The primary key for the `user_permissions` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `user_permissions` table. All the data in the column will be lost.
  - You are about to drop the column `permissionsId` on the `user_permissions` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "user_permissions" DROP CONSTRAINT "user_permissions_permissionsId_fkey";

-- AlterTable
ALTER TABLE "user_permissions" DROP CONSTRAINT "user_permissions_pkey",
DROP COLUMN "id",
DROP COLUMN "permissionsId",
ADD CONSTRAINT "user_permissions_pkey" PRIMARY KEY ("user_id", "permission_id");

-- AddForeignKey
ALTER TABLE "user_permissions" ADD CONSTRAINT "user_permissions_permission_id_fkey" FOREIGN KEY ("permission_id") REFERENCES "permissions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
