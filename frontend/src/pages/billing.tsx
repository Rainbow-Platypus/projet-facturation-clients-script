import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useCachedData } from '../hooks/useCachedData';

const BillingPage = () => {
  const { data, isLoading, error } = useCachedData();

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

  const chartData = data.clients.map(client => ({
    name: client.name,
    facturation: client.totalBilling,
    equipements: client.billableEquipment
  }));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Facturation</h1>
      
      <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Résumé de la facturation</h2>
        <p>Nombre total de clients: {data.clients.length}</p>
        <p>Nombre total d'équipements facturables: {data.totalBillableEquipment}</p>
        <p>Revenu mensuel total: {data.totalRevenue} €</p>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Graphique de facturation par client</h2>
        <div style={{ width: '100%', height: 400 }}>
          <ResponsiveContainer>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
              <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
              <Tooltip />
              <Legend />
              <Bar yAxisId="left" dataKey="facturation" fill="#8884d8" name="Facturation (€)" />
              <Bar yAxisId="right" dataKey="equipements" fill="#82ca9d" name="Équipements facturables" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default BillingPage;