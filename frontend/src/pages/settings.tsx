import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SettingsPage = () => {
  const [pricePerEquipment, setPricePerEquipment] = useState(9);
  const [cacheExpiration, setCacheExpiration] = useState(60);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await axios.get('/api/settings');
        setPricePerEquipment(response.data.pricePerEquipment);
        setCacheExpiration(response.data.cacheExpiration);
      } catch (error) {
        console.error("Erreur lors du chargement des paramètres:", error);
        setError(`Erreur lors du chargement des paramètres: ${error.response?.data?.message || error.message}`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      await axios.post('/api/settings', { pricePerEquipment, cacheExpiration });
      alert('Paramètres sauvegardés !');
    } catch (error) {
      console.error("Erreur lors de la sauvegarde des paramètres:", error);
      setError(`Erreur lors de la sauvegarde des paramètres: ${error.response?.data?.message || error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Chargement des paramètres...</div>;
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Paramètres</h1>
      
      <form onSubmit={handleSubmit} className="bg-white shadow overflow-hidden sm:rounded-lg p-6">
        <div className="mb-4">
          <label htmlFor="pricePerEquipment" className="block text-sm font-medium text-gray-700">
            Prix par équipement (€)
          </label>
          <input
            type="number"
            id="pricePerEquipment"
            value={pricePerEquipment}
            onChange={(e) => setPricePerEquipment(Number(e.target.value))}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="cacheExpiration" className="block text-sm font-medium text-gray-700">
            Expiration du cache (minutes)
          </label>
          <input
            type="number"
            id="cacheExpiration"
            value={cacheExpiration}
            onChange={(e) => setCacheExpiration(Number(e.target.value))}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>

        <button
          type="submit"
          className="mt-4 px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Sauvegarder les paramètres
        </button>
      </form>
    </div>
  );
};

export default SettingsPage;