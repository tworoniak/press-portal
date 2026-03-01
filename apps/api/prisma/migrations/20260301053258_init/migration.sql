-- CreateEnum
CREATE TYPE "InteractionType" AS ENUM ('EMAIL', 'CALL', 'TEXT', 'DM', 'MEETING', 'NOTE');

-- CreateEnum
CREATE TYPE "OutreachStatus" AS ENUM ('NOT_CONTACTED', 'CONTACTED', 'RESPONDED', 'CONFIRMED', 'PUBLISHED', 'ARCHIVED');

-- CreateTable
CREATE TABLE "Contact" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "firstName" TEXT,
    "lastName" TEXT,
    "displayName" TEXT,
    "role" TEXT,
    "company" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "website" TEXT,
    "timezone" TEXT,
    "notes" TEXT,
    "doNotContact" BOOLEAN NOT NULL DEFAULT false,
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "status" "OutreachStatus" NOT NULL DEFAULT 'NOT_CONTACTED',
    "lastContactedAt" TIMESTAMP(3),

    CONSTRAINT "Contact_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Band" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "genre" TEXT,
    "country" TEXT,
    "website" TEXT,
    "spotifyUrl" TEXT,
    "instagram" TEXT,
    "notes" TEXT,

    CONSTRAINT "Band_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Festival" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "location" TEXT,
    "website" TEXT,
    "instagram" TEXT,
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "credentialInfo" TEXT,
    "notes" TEXT,

    CONSTRAINT "Festival_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContactBand" (
    "contactId" TEXT NOT NULL,
    "bandId" TEXT NOT NULL,
    "relationshipRole" TEXT,
    "relationshipNotes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ContactBand_pkey" PRIMARY KEY ("contactId","bandId")
);

-- CreateTable
CREATE TABLE "ContactFestival" (
    "contactId" TEXT NOT NULL,
    "festivalId" TEXT NOT NULL,
    "relationshipRole" TEXT,
    "relationshipNotes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ContactFestival_pkey" PRIMARY KEY ("contactId","festivalId")
);

-- CreateTable
CREATE TABLE "Interaction" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "type" "InteractionType" NOT NULL,
    "occurredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "subject" TEXT,
    "notes" TEXT,
    "outcome" TEXT,
    "nextFollowUpAt" TIMESTAMP(3),
    "contactId" TEXT NOT NULL,
    "bandId" TEXT,
    "festivalId" TEXT,

    CONSTRAINT "Interaction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Contact_email_key" ON "Contact"("email");

-- CreateIndex
CREATE INDEX "Contact_lastName_idx" ON "Contact"("lastName");

-- CreateIndex
CREATE INDEX "Contact_company_idx" ON "Contact"("company");

-- CreateIndex
CREATE INDEX "Contact_status_idx" ON "Contact"("status");

-- CreateIndex
CREATE UNIQUE INDEX "Band_name_key" ON "Band"("name");

-- CreateIndex
CREATE INDEX "Band_name_idx" ON "Band"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Festival_name_key" ON "Festival"("name");

-- CreateIndex
CREATE INDEX "Festival_name_idx" ON "Festival"("name");

-- CreateIndex
CREATE INDEX "ContactBand_bandId_idx" ON "ContactBand"("bandId");

-- CreateIndex
CREATE INDEX "ContactFestival_festivalId_idx" ON "ContactFestival"("festivalId");

-- CreateIndex
CREATE INDEX "Interaction_contactId_occurredAt_idx" ON "Interaction"("contactId", "occurredAt");

-- CreateIndex
CREATE INDEX "Interaction_bandId_idx" ON "Interaction"("bandId");

-- CreateIndex
CREATE INDEX "Interaction_festivalId_idx" ON "Interaction"("festivalId");

-- CreateIndex
CREATE INDEX "Interaction_nextFollowUpAt_idx" ON "Interaction"("nextFollowUpAt");

-- AddForeignKey
ALTER TABLE "ContactBand" ADD CONSTRAINT "ContactBand_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "Contact"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContactBand" ADD CONSTRAINT "ContactBand_bandId_fkey" FOREIGN KEY ("bandId") REFERENCES "Band"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContactFestival" ADD CONSTRAINT "ContactFestival_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "Contact"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContactFestival" ADD CONSTRAINT "ContactFestival_festivalId_fkey" FOREIGN KEY ("festivalId") REFERENCES "Festival"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Interaction" ADD CONSTRAINT "Interaction_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "Contact"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Interaction" ADD CONSTRAINT "Interaction_bandId_fkey" FOREIGN KEY ("bandId") REFERENCES "Band"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Interaction" ADD CONSTRAINT "Interaction_festivalId_fkey" FOREIGN KEY ("festivalId") REFERENCES "Festival"("id") ON DELETE SET NULL ON UPDATE CASCADE;
