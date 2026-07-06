-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'CLIENT');

-- CreateEnum
CREATE TYPE "StatutColis" AS ENUM ('ACHAT_EFFECTUE', 'EXPEDIE_VENDEUR', 'ARRIVE_TRANSITAIRE', 'EN_TRAITEMENT', 'ENVOYE_MALI', 'ARRIVE_MALI', 'DISPONIBLE', 'RECUPERE');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "telephone" TEXT NOT NULL,
    "email" TEXT,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'CLIENT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Colis" (
    "id" TEXT NOT NULL,
    "codeSuivi" TEXT NOT NULL,
    "clientId" TEXT,
    "telephoneClient" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "statutActuel" "StatutColis" NOT NULL DEFAULT 'ACHAT_EFFECTUE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Colis_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HistoriqueStatut" (
    "id" TEXT NOT NULL,
    "colisId" TEXT NOT NULL,
    "statut" "StatutColis" NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "commentaire" TEXT,

    CONSTRAINT "HistoriqueStatut_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_telephone_key" ON "User"("telephone");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Colis_codeSuivi_key" ON "Colis"("codeSuivi");

-- AddForeignKey
ALTER TABLE "Colis" ADD CONSTRAINT "Colis_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HistoriqueStatut" ADD CONSTRAINT "HistoriqueStatut_colisId_fkey" FOREIGN KEY ("colisId") REFERENCES "Colis"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
