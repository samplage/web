/*
  Warnings:

  - You are about to drop the `Note` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `updatedAt` to the `Sample` table without a default value. This is not possible if the table is not empty.
  - Made the column `authorId` on table `Sample` required. This step will fail if there are existing NULL values in that column.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Note";
PRAGMA foreign_keys=on;

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_SampleTagRelationship" (
    "tagId" TEXT NOT NULL,
    "sampleId" TEXT NOT NULL,
    CONSTRAINT "SampleTagRelationship_sampleId_fkey" FOREIGN KEY ("sampleId") REFERENCES "Sample" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "SampleTagRelationship_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "Tag" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_SampleTagRelationship" ("sampleId", "tagId") SELECT "sampleId", "tagId" FROM "SampleTagRelationship";
DROP TABLE "SampleTagRelationship";
ALTER TABLE "new_SampleTagRelationship" RENAME TO "SampleTagRelationship";
CREATE UNIQUE INDEX "SampleTagRelationship_tagId_sampleId_key" ON "SampleTagRelationship"("tagId", "sampleId");
CREATE TABLE "new_Sample" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "title" TEXT NOT NULL,
    "transcript" TEXT NOT NULL,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "authorId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    CONSTRAINT "Sample_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Sample_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Sample" ("authorId", "categoryId", "createdAt", "id", "published", "title", "transcript") SELECT "authorId", "categoryId", "createdAt", "id", "published", "title", "transcript" FROM "Sample";
DROP TABLE "Sample";
ALTER TABLE "new_Sample" RENAME TO "Sample";
CREATE TABLE "new_Vote" (
    "voterId" TEXT NOT NULL,
    "sampleId" TEXT NOT NULL,
    "score" INTEGER NOT NULL,
    CONSTRAINT "Vote_voterId_fkey" FOREIGN KEY ("voterId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Vote_sampleId_fkey" FOREIGN KEY ("sampleId") REFERENCES "Sample" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Vote" ("sampleId", "score", "voterId") SELECT "sampleId", "score", "voterId" FROM "Vote";
DROP TABLE "Vote";
ALTER TABLE "new_Vote" RENAME TO "Vote";
CREATE UNIQUE INDEX "Vote_voterId_sampleId_key" ON "Vote"("voterId", "sampleId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
