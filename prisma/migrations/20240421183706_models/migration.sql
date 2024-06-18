-- CreateEnum
CREATE TYPE "Param_type" AS ENUM ('STRING', 'NUMBER', 'DATE');

-- CreateEnum
CREATE TYPE "Link_type" AS ENUM ('externo', 'metabase');

-- AlterTable
ALTER TABLE "Link" ADD COLUMN     "categoryId" INTEGER,
ALTER COLUMN "description" DROP NOT NULL;

-- CreateTable
CREATE TABLE "Category" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "type" "Link_type" NOT NULL,
    "description" TEXT,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Query_params" (
    "id" SERIAL NOT NULL,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "type" "Param_type" NOT NULL,
    "linkId" INTEGER NOT NULL,

    CONSTRAINT "Query_params_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Link" ADD CONSTRAINT "Link_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Query_params" ADD CONSTRAINT "Query_params_linkId_fkey" FOREIGN KEY ("linkId") REFERENCES "Link"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
