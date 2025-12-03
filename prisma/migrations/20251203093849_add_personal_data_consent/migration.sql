-- CreateTable
CREATE TABLE "QuestionnaireResponse" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "startedAt" DATETIME NOT NULL,
    "completedAt" DATETIME,
    "age" TEXT,
    "gender" TEXT,
    "education" TEXT,
    "employment" TEXT,
    "relationshipStatus" TEXT,
    "answers" TEXT NOT NULL,
    "analysis" TEXT,
    "patientName" TEXT,
    "patientEmail" TEXT,
    "notes" TEXT,
    "personalDataConsent" BOOLEAN NOT NULL DEFAULT false,
    "consentDate" DATETIME
);

-- CreateIndex
CREATE INDEX "QuestionnaireResponse_createdAt_idx" ON "QuestionnaireResponse"("createdAt");

-- CreateIndex
CREATE INDEX "QuestionnaireResponse_completedAt_idx" ON "QuestionnaireResponse"("completedAt");
