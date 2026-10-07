-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_site_settings" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "logo" TEXT,
    "favicon" TEXT,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "whatsapp" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "instagram" TEXT NOT NULL,
    "facebook" TEXT NOT NULL DEFAULT '',
    "address" TEXT NOT NULL,
    "heroTitle" TEXT NOT NULL,
    "heroSubtitle" TEXT NOT NULL,
    "heroText" TEXT NOT NULL,
    "heroButtonText" TEXT NOT NULL,
    "heroButtonLink" TEXT NOT NULL,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_site_settings" ("address", "description", "email", "favicon", "heroButtonLink", "heroButtonText", "heroSubtitle", "heroText", "heroTitle", "id", "instagram", "logo", "phone", "title", "updatedAt", "whatsapp") SELECT "address", "description", "email", "favicon", "heroButtonLink", "heroButtonText", "heroSubtitle", "heroText", "heroTitle", "id", "instagram", "logo", "phone", "title", "updatedAt", "whatsapp" FROM "site_settings";
DROP TABLE "site_settings";
ALTER TABLE "new_site_settings" RENAME TO "site_settings";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
