-- CreateTable
CREATE TABLE "automation_logs" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "type" TEXT NOT NULL,
    "firmId" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "details" TEXT NOT NULL,
    "timestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "automation_logs_firmId_fkey" FOREIGN KEY ("firmId") REFERENCES "firms" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "affiliate_partners" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "affiliateCode" TEXT NOT NULL,
    "companyName" TEXT,
    "website" TEXT,
    "commissionRate" REAL NOT NULL DEFAULT 0.10,
    "paymentMethod" TEXT NOT NULL DEFAULT 'PAYPAL',
    "paymentDetails" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "totalEarnings" REAL NOT NULL DEFAULT 0,
    "totalReferrals" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "affiliate_partners_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "affiliate_referrals" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "affiliateId" TEXT NOT NULL,
    "referredUserId" TEXT NOT NULL,
    "referralCode" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "conversionDate" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "affiliate_referrals_affiliateId_fkey" FOREIGN KEY ("affiliateId") REFERENCES "affiliate_partners" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "affiliate_referrals_referredUserId_fkey" FOREIGN KEY ("referredUserId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "affiliate_commissions" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "affiliateId" TEXT NOT NULL,
    "referralId" TEXT NOT NULL,
    "amount" REAL NOT NULL,
    "commissionRate" REAL NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "paymentDate" DATETIME,
    "paymentMethod" TEXT,
    "paymentReference" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "affiliate_commissions_affiliateId_fkey" FOREIGN KEY ("affiliateId") REFERENCES "affiliate_partners" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "affiliate_commissions_referralId_fkey" FOREIGN KEY ("referralId") REFERENCES "affiliate_referrals" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "affiliate_partners_userId_key" ON "affiliate_partners"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "affiliate_partners_affiliateCode_key" ON "affiliate_partners"("affiliateCode");

-- CreateIndex
CREATE UNIQUE INDEX "affiliate_referrals_affiliateId_referredUserId_key" ON "affiliate_referrals"("affiliateId", "referredUserId");
