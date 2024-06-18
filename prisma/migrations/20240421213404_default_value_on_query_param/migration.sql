/*
  Warnings:

  - You are about to drop the column `value` on the `Query_params` table. All the data in the column will be lost.
  - Added the required column `defaultValue` to the `Query_params` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Query_params" DROP COLUMN "value",
ADD COLUMN     "defaultValue" TEXT NOT NULL;
