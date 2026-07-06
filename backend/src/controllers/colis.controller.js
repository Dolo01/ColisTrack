import { prisma } from '../server.js';

// --- Client Endpoints ---

export const getMyColis = async (req, res) => {
  try {
    const colis = await prisma.colis.findMany({
      where: { clientId: req.userId },
      orderBy: { createdAt: 'desc' }
    });
    res.status(200).json(colis);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération de vos colis.' });
  }
};

export const getMyColisById = async (req, res) => {
  try {
    const { id } = req.params;
    const colis = await prisma.colis.findFirst({
      where: {
        id,
        clientId: req.userId
      },
      include: {
        historique: {
          orderBy: { date: 'asc' }
        }
      }
    });

    if (!colis) {
      return res.status(404).json({ message: 'Colis non trouvé ou accès refusé.' });
    }

    res.status(200).json(colis);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};

// --- Admin Endpoints ---

export const getAllColis = async (req, res) => {
  try {
    const colis = await prisma.colis.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        client: {
          select: { nom: true }
        }
      }
    });
    res.status(200).json(colis);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des colis.' });
  }
};

export const getColisById = async (req, res) => {
  try {
    const { id } = req.params;
    const colis = await prisma.colis.findUnique({
      where: { id },
      include: {
        client: {
          select: { nom: true, email: true }
        },
        historique: {
          orderBy: { date: 'asc' }
        }
      }
    });

    if (!colis) {
      return res.status(404).json({ message: 'Colis non trouvé.' });
    }

    res.status(200).json(colis);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};

export const createColis = async (req, res) => {
  try {
    const { telephoneClient, description } = req.body;

    // Generate a tracking code CT-YYYY-RANDOM
    const year = new Date().getFullYear();
    const randomPart = Math.floor(1000 + Math.random() * 9000);
    const codeSuivi = `CT-${year}-${randomPart}`;

    // Try to find the user to link
    const user = await prisma.user.findUnique({
      where: { telephone: telephoneClient }
    });

    const colis = await prisma.colis.create({
      data: {
        codeSuivi,
        telephoneClient,
        description,
        clientId: user ? user.id : null,
        statutActuel: 'ACHAT_EFFECTUE',
        historique: {
          create: {
            statut: 'ACHAT_EFFECTUE',
            commentaire: 'Colis enregistré.'
          }
        }
      }
    });

    res.status(201).json(colis);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la création du colis.' });
  }
};

export const updateColisStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { statut, commentaire } = req.body;

    const colis = await prisma.colis.update({
      where: { id },
      data: {
        statutActuel: statut,
        historique: {
          create: {
            statut,
            commentaire
          }
        }
      }
    });

    res.status(200).json(colis);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la mise à jour du statut.' });
  }
};
