-- CreateTable
CREATE TABLE "sponsor_banners" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "desktop" TEXT,
    "mobile" TEXT,
    "tablet" TEXT,
    "event_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),
    "status" "UserStatus" NOT NULL DEFAULT 'ACTIVE',

    CONSTRAINT "sponsor_banners_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "sponsor_banners" ADD CONSTRAINT "sponsor_banners_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
