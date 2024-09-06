import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import { fetchCompanies, fetchClientEquipment } from './services/serviceNavApi';

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// Fonction pour synchroniser les données depuis ServiceNav
async function syncDataFromServiceNav() {
  const companies = await fetchCompanies();
  
  for (const company of companies) {
    const client = await prisma.client.upsert({
      where: { id: company.id },
      update: { name: company.name },
      create: { id: company.id, name: company.name },
    });

    const equipment = await fetchClientEquipment(company.id);
    for (const eq of equipment) {
      await prisma.equipment.upsert({
        where: { id: eq.id },
        update: {
          name: eq['Host Name'],
          category: eq['Category Name'],
          isBillable: ['serveur', 'serveur linux', 'serveur windows'].includes(eq['Category Name'].toLowerCase()),
        },
        create: {
          id: eq.id,
          name: eq['Host Name'],
          category: eq['Category Name'],
          isBillable: ['serveur', 'serveur linux', 'serveur windows'].includes(eq['Category Name'].toLowerCase()),
          clientId: client.id,
        },
      });
    }
  }
}

// Route pour forcer la synchronisation
app.post('/api/sync', async (req, res) => {
  try {
    await syncDataFromServiceNav();
    res.json({ message: 'Synchronisation réussie' });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la synchronisation' });
  }
});

// Route pour obtenir tous les clients
app.get('/api/clients', async (req, res) => {
  const clients = await prisma.client.findMany({
    include: { equipment: true },
  });
  res.json(clients);
});

// Route pour obtenir les équipements d'un client
app.get('/api/clients/:id/equipment', async (req, res) => {
  const { id } = req.params;
  const equipment = await prisma.equipment.findMany({
    where: { clientId: id },
  });
  res.json(equipment);
});

// Route pour créer une facture
app.post('/api/invoices', async (req, res) => {
  const { clientId, amount, date } = req.body;
  const invoice = await prisma.invoice.create({
    data: { clientId, amount, date: new Date(date) },
  });
  res.json(invoice);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});