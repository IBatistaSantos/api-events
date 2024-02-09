-- CreateTable
CREATE TABLE "lives" (
    "id" TEXT NOT NULL,
    "session_id" TEXT NOT NULL,
    "event_id" TEXT NOT NULL,
    "title" TEXT,
    "link" TEXT NOT NULL,
    "type_link" TEXT,
    "enable_translate" BOOLEAN NOT NULL DEFAULT false,
    "finished" BOOLEAN NOT NULL DEFAULT false,
    "finished_at" TIMESTAMP(3),
    "is_main" BOOLEAN NOT NULL DEFAULT false,
    "disable_chat" BOOLEAN NOT NULL DEFAULT false,
    "disable_reactions" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "status" "UserStatus" NOT NULL DEFAULT 'ACTIVE',
    "chat_id" TEXT,

    CONSTRAINT "lives_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "live_chats" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "type" TEXT NOT NULL,

    CONSTRAINT "live_chats_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "live_translations" (
    "id" TEXT NOT NULL,
    "live_id" TEXT NOT NULL,
    "language" TEXT NOT NULL,
    "link" TEXT NOT NULL,
    "text" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "status" "UserStatus" NOT NULL DEFAULT 'ACTIVE',

    CONSTRAINT "live_translations_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "lives" ADD CONSTRAINT "lives_chat_id_fkey" FOREIGN KEY ("chat_id") REFERENCES "live_chats"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lives" ADD CONSTRAINT "lives_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "sessions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lives" ADD CONSTRAINT "lives_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "live_translations" ADD CONSTRAINT "live_translations_live_id_fkey" FOREIGN KEY ("live_id") REFERENCES "lives"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
