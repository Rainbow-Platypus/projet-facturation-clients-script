import React, { useState, useEffect, useMemo } from 'react';
import { Users, Laptop, DollarSign, ArrowUpRight, BarChart2, Search } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import axios from 'axios';
import { useCachedData } from '../hooks/useCachedData';
import { Client } from '../types';

const PRICE_PER_EQUIPMENT = 9;

const StatCard = ({ title, value, icon: Icon, change }) => (
  <div className="bg-white rounded-lg shadow p-4">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <p className="text-xl font-semibold text-gray-800">{value}</p>
      </div>
      <div className="bg-blue-100 rounded-full p-2">
        <Icon className="text-blue-500" size={20} />
      </div>
    </div>
    <div className="mt-2 flex items-center text-xs text-green-600">
      <ArrowUpRight size={12} />
      <span className="ml-1">{change}</span>
    </div>
  </div>
);

const ClientList = ({ clients, searchTerm }) => {
  const router = useRouter();
  const filteredClients = useMemo(() => {
    return clients.filter(client => 
      client.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [clients, searchTerm]);

  const handleRowClick = (clientId) => {
    router.push(`/clients/${clientId}`);
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="max-h-96 overflow-y-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50 sticky top-0">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Équipements</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Équipements Facturables</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Facturation</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">% Facturable</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredClients.map((client) => (
              <tr 
                key={client.id} 
                onClick={() => handleRowClick(client.id)}
                className="hover:bg-gray-100 cursor-pointer"
              >
                <td className="px-6 py-4 whitespace-nowrap">{client.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{client.totalEquipment}</td>
                <td className="px-6 py-4 whitespace-nowrap">{client.billableEquipment}</td>
                <td className="px-6 py-4 whitespace-nowrap">{client.totalBilling} €</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {client.totalEquipment > 0 
                    ? `${((client.billableEquipment / client.totalEquipment) * 100).toFixed(1)}%`
                    : '0%'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const BillingChart = () => (
  <div className="bg-white rounded-lg shadow p-6">
    <h2 className="text-lg font-semibold text-gray-800 mb-4">Aperçu de la Facturation</h2>
    <div className="h-64 flex items-center justify-center">
      <BarChart2 size={100} className="text-gray-400" />
      <p className="ml-4 text-gray-500">Graphique de facturation (à implémenter)</p>
    </div>
  </div>
);

export default function HomePage() {
  const { data, isLoading, error } = useCachedData();
  const [searchTerm, setSearchTerm] = useState('');

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Chargement des données...</div>;
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-screen">
        <div className="text-red-500 mb-4">Erreur: {error}</div>
        <button 
          onClick={() => window.location.reload()} 
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Réessayer
        </button>
      </div>
    );
  }

  const { clients, totalEquipment, totalBillableEquipment, totalRevenue } = data;

  return (
    <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Tableau de Bord</h1>
      
      <div className="grid grid-cols-4 gap-4 mb-8">
        <StatCard title="Total Clients" value={clients.length} icon={Users} change={`${clients.length} clients actifs`} />
        <StatCard title="Total Équipements" value={totalEquipment} icon={Laptop} change={`${totalEquipment} équipements`} />
        <StatCard title="Équipements Facturables" value={totalBillableEquipment} icon={Laptop} change={`${totalBillableEquipment} sur ${totalEquipment}`} />
        <StatCard title="Revenu Mensuel" value={`${totalRevenue} €`} icon={DollarSign} change={`${totalBillableEquipment} équipements à ${PRICE_PER_EQUIPMENT}€`} />
      </div>

      <div className="mb-4 relative">
        <input
          type="text"
          placeholder="Rechercher un client..."
          className="w-full px-4 py-2 border rounded-md"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Search className="absolute right-3 top-2.5 text-gray-400" size={20} />
      </div>

      <div className="mb-8">
        <ClientList clients={clients} searchTerm={searchTerm} />
      </div>

      <div className="mt-8">
        <BillingChart />
      </div>
    </div>
  );
}