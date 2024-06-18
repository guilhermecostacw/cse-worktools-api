-- AlterTable
ALTER TABLE "Category" ADD COLUMN     "ownerId" INTEGER NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE "Link" ALTER COLUMN "ownerId" DROP DEFAULT;

-- AddForeignKey
ALTER TABLE "Category" ADD CONSTRAINT "Category_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
