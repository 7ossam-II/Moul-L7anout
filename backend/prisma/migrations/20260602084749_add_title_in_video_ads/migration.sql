/*
  Warnings:

  - Added the required column `title` to the `video_ads` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "video_ads" ADD COLUMN     "title" TEXT NOT NULL;
