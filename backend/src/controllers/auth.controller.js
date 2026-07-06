import { prisma } from '../server.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const register = async (req, res) => {
  try {
    const { nom, telephone, email, password } = req.body;

    // Check if phone exists
    const existingUser = await prisma.user.findUnique({
      where: { telephone }
    });

    if (existingUser) {
      return res.status(400).json({ message: 'Ce numéro de téléphone est déjà utilisé.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        nom,
        telephone,
        email,
        password: hashedPassword,
        role: 'CLIENT'
      }
    });

    // Auto-link existing packages with this phone number
    await prisma.colis.updateMany({
      where: {
        telephoneClient: telephone,
        clientId: null
      },
      data: {
        clientId: user.id
      }
    });

    res.status(201).json({ message: 'Compte créé avec succès.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de la création du compte.' });
  }
};

export const login = async (req, res) => {
  try {
    const { telephone, password } = req.body; // allow email too in future, but let's stick to telephone or email

    // Try finding by phone or email (for admin)
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { telephone: telephone },
          { email: telephone } // allow typing email in the same field for admin
        ]
      }
    });

    if (!user) {
      return res.status(401).json({ message: 'Identifiants invalides.' });
    }

    const passwordIsValid = await bcrypt.compare(password, user.password);

    if (!passwordIsValid) {
      return res.status(401).json({ message: 'Identifiants invalides.' });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: 86400 } // 24 hours
    );

    res.status(200).json({
      id: user.id,
      nom: user.nom,
      telephone: user.telephone,
      email: user.email,
      role: user.role,
      accessToken: token
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de la connexion.' });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      select: {
        id: true,
        nom: true,
        telephone: true,
        email: true,
        role: true
      }
    });

    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé.' });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};
