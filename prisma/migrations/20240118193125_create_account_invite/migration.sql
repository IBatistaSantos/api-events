-- CreateEnum
CREATE TYPE "AccountType" AS ENUM ('FREE', 'ENTERPRISE');

-- CreateTable
CREATE TABLE "accounts" (
    "id" TEXT NOT NULL,
    "type" "AccountType" NOT NULL,
    "event" BOOLEAN NOT NULL DEFAULT true,
    "organization" BOOLEAN NOT NULL DEFAULT true,
    "checkin" BOOLEAN NOT NULL DEFAULT true,
    "certificate" BOOLEAN NOT NULL DEFAULT false,
    "campaign" BOOLEAN NOT NULL DEFAULT false,
    "lobby" BOOLEAN NOT NULL DEFAULT false,
    "videoLibrary" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "invite_accounts" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "AccountType" NOT NULL,
    "email" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "event" BOOLEAN NOT NULL DEFAULT true,
    "organization" BOOLEAN NOT NULL DEFAULT true,
    "checkin" BOOLEAN NOT NULL DEFAULT true,
    "certificate" BOOLEAN NOT NULL DEFAULT false,
    "campaign" BOOLEAN NOT NULL DEFAULT false,
    "lobby" BOOLEAN NOT NULL DEFAULT false,
    "videoLibrary" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "invite_accounts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "invite_accounts_email_key" ON "invite_accounts"("email");

-- CreateIndex
CREATE UNIQUE INDEX "invite_accounts_token_key" ON "invite_accounts"("token");
