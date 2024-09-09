import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/router';
import { Users, Laptop, DollarSign, ArrowUpRight, ArrowLeft } from 'lucide-react';
import axios from 'axios';
import { Equipment } from '../../types';

const BILLABLE_CATEGORIES = ['serveur', 'serveur linux', 'serveur windows'];
const PRICE_PER_EQUIPMENT = 9;

const StatCard = ({ title, value, icon: Icon, change }) => (
  <div className="bg-white rounded-lg shadow p-6">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <p className="text-2xl font-semibold text-gray-800">{value}</p>
      </div>
      <div className="bg-blue-100 rounded-full p-3">
        <Icon className="text-blue-500" size={24} />
      </div>
    </div>
    <div className="mt-4 flex items-center text-sm text-green-600">
      <ArrowUpRight size={16} />
      <span className="ml-1">{change}</span>
    </div>
  </div>
);

const EquipmentCard = ({ equipment }: { equipment: Equipment }) => {
  const isBillable = BILLABLE_CATEGORIES.includes(equipment['Category Name'].toLowerCase());
  return (
    <div className={`bg-white rounded-lg shadow p-4 ${isBillable ? 'border-l-4 border-green-500' : ''}`}>
      <h3 className="font-bold text-lg mb-2">{equipment['Host Name']}</h3>
      <p><span className="font-medium">IP/DNS:</span> {equipment['Host IP/DNS']}</p>
      <p><span className="font-medium">Catégorie:</span> {equipment['Category Name']}</p>
      <p><span className="font-medium">Facturable:</span> {isBillable ? 'Oui' : 'Non'}</p>
    </div>
  );
};

const EquipmentList = ({ equipment, title }: { equipment: Equipment[], title: string }) => (
  <div className="mt-8">
    <h2 className="text-2xl font-bold text-gray-900 mb-4">{title} ({equipment.length})</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {equipment.map((eq) => (
        <EquipmentCard key={eq.id} equipment={eq} />
      ))}
    </div>
  </div>
);

export default function ClientDetailsPage() {
  const router = useRouter();
  const { id } = router.query;
  const [clientData, setClientData] = useState<{ name: string, equipment: Equipment[] } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;

      setIsLoading(true);
      setError(null);
      try {
        const response = await axios.get(`/api/clients/${id}`);
        setClientData(response.data);
      } catch (error) {
        console.error("Erreur lors du chargement des données du client:", error);
        setError(`Erreur lors du chargement des données du client: ${error.response?.data?.message || error.message}`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const { billableEquipment, nonBillableEquipment, totalRevenue } = useMemo(() => {
    if (!clientData) return { billableEquipment: [], nonBillableEquipment: [], totalRevenue: 0 };

    const billable = clientData.equipment.filter(eq => 
      BILLABLE_CATEGORIES.includes(eq['Category Name'].toLowerCase())
    );
    const nonBillable = clientData.equipment.filter(eq => 
      !BILLABLE_CATEGORIES.includes(eq['Category Name'].toLowerCase())
    );
    const revenue = billable.length * PRICE_PER_EQUIPMENT;
    return { billableEquipment: billable, nonBillableEquipment: nonBillable, totalRevenue: revenue };
  }, [clientData]);

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Chargement des données...</div>;
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-screen">
        <div className="text-red-500 mb-4">Erreur: {error}</div>
        <button 
          onClick={() => router.reload()} 
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Réessayer
        </button>
      </div>
    );
  }

  if (!clientData) {
    return <div className="flex justify-center items-center h-screen">Aucune donnée disponible</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button onClick={() => router.back()} className="mb-6 flex items-center text-blue-600 hover:text-blue-800">
        <ArrowLeft className="mr-2" size={20} />
        Retour
      </button>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">{clientData.name}</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard 
          title="Total Équipements" 
          value={clientData.equipment.length} 
          icon={Laptop} 
          change={`${clientData.equipment.length} équipements`} 
        />
        <StatCard 
          title="Équipements Facturables" 
          value={billableEquipment.length} 
          icon={Laptop} 
          change={`${billableEquipment.length} sur ${clientData.equipment.length}`} 
        />
        <StatCard 
          title="Revenu Mensuel" 
          value={`${totalRevenue} €`} 
          icon={DollarSign} 
          change={`${billableEquipment.length} équipements à ${PRICE_PER_EQUIPMENT}€`} 
        />
      </div>

      <EquipmentList equipment={billableEquipment} title="Équipements Facturables" />
      <EquipmentList equipment={nonBillableEquipment} title="Équipements Non Facturables" />
    </div>
  );
}