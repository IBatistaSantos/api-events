-- CreateEnum
CREATE TYPE "EventType" AS ENUM ('DIGITAL', 'PRESENCIAL', 'HIBRIDO');

-- CreateEnum
CREATE TYPE "InscriptionType" AS ENUM ('RELEASED', 'PAUSED', 'FINISHED');

-- CreateTable
CREATE TABLE "events" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "EventType" NOT NULL DEFAULT 'DIGITAL',
    "url" TEXT NOT NULL,
    "incriptionType" "InscriptionType" NOT NULL DEFAULT 'RELEASED',
    "organization_id" TEXT NOT NULL,
    "account_id" TEXT NOT NULL,
    "private" BOOLEAN NOT NULL DEFAULT false,
    "status" "UserStatus" NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "features_flags_id" TEXT NOT NULL,

    CONSTRAINT "events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "event_feature_flags" (
    "id" TEXT NOT NULL,
    "single_access" BOOLEAN NOT NULL DEFAULT false,
    "confirm_email" BOOLEAN NOT NULL DEFAULT false,
    "code_access" BOOLEAN NOT NULL DEFAULT false,
    "password_required" BOOLEAN NOT NULL DEFAULT true,
    "email_required" BOOLEAN NOT NULL DEFAULT true,
    "captcha" BOOLEAN NOT NULL DEFAULT false,
    "ticket" BOOLEAN NOT NULL DEFAULT false,
    "has_installments" BOOLEAN NOT NULL DEFAULT false,
    "send_mail_inscription" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "event_feature_flags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sessions" (
    "id" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "hour_start" TEXT NOT NULL,
    "hour_end" TEXT NOT NULL,
    "is_current" BOOLEAN NOT NULL DEFAULT false,
    "event_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "events_url_key" ON "events"("url");

-- AddForeignKey
ALTER TABLE "events" ADD CONSTRAINT "events_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "events" ADD CONSTRAINT "events_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "events" ADD CONSTRAINT "events_features_flags_id_fkey" FOREIGN KEY ("features_flags_id") REFERENCES "event_feature_flags"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
