-- AlterTable
ALTER TABLE "Student" ADD COLUMN     "isPaid" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "secondPhone" TEXT;

-- AlterTable
ALTER TABLE "Teacher" ADD COLUMN     "secondPhone" TEXT;
