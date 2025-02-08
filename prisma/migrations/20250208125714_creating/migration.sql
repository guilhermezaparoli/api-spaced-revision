-- AlterTable
ALTER TABLE "tasks" ADD COLUMN     "intervals" INTEGER[] DEFAULT ARRAY[1, 7, 14, 30, 60]::INTEGER[];
