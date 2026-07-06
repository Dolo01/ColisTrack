import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes.js';
import colisRoutes from './routes/colis.routes.js';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

dotenv.config();

const app = express();
export const prisma = new PrismaClient();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/colis', colisRoutes);

// Base route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to ColisTrack API' });
});

// Seed Admin User Function
const seedAdmin = async () => {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (adminEmail && adminPassword) {
    const existingAdmin = await prisma.user.findUnique({
      where: { email: adminEmail }
    });

    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash(adminPassword, 10);
      await prisma.user.create({
        data: {
          nom: 'Admin',
          telephone: '00000000', // Placeholder for admin
          email: adminEmail,
          password: hashedPassword,
          role: 'ADMIN'
        }
      });
      console.log('Default Admin user created.');
    }
  }
};

const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);
  await seedAdmin();
});
