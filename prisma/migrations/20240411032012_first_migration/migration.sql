-- CreateTable
CREATE TABLE "Link" (
    "id" SERIAL NOT NULL,
    "endpoint" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "Link_pkey" PRIMARY KEY ("id")
);
