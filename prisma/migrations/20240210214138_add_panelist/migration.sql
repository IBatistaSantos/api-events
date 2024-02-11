-- CreateTable
CREATE TABLE "panelists" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "description" TEXT,
    "office" TEXT NOT NULL,
    "event_id" TEXT NOT NULL,
    "photo" TEXT,
    "section_name" TEXT,
    "is_principal" BOOLEAN NOT NULL DEFAULT false,
    "color_principal" TEXT,
    "increase_size" BOOLEAN NOT NULL DEFAULT false,
    "status" "UserStatus" NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "panelists_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "panelists" ADD CONSTRAINT "panelists_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
