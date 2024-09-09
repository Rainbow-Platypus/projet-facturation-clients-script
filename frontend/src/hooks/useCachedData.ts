import { useState, useEffect } from 'react';
import axios from 'axios';
import { DashboardData } from '../types';

const CACHE_KEY = 'dashboardData';
const CACHE_EXPIRATION = 60 * 60 * 1000; // 1 hour in milliseconds

export const useCachedData = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const cachedData = localStorage.getItem(CACHE_KEY);
        if (cachedData) {
          const { timestamp, data: parsedData } = JSON.parse(cachedData);
          if (Date.now() - timestamp < CACHE_EXPIRATION) {
            setData(parsedData);
            setIsLoading(false);
            return;
          }
        }

        const response = await axios.get<DashboardData>('/api/dashboard');
        const newData = response.data;

        localStorage.setItem(CACHE_KEY, JSON.stringify({
          timestamp: Date.now(),
          data: newData
        }));

        setData(newData);
      } catch (error) {
        console.error("Error loading data:", error);
        setError(`Error loading data: ${error.response?.data?.message || error.message}`);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  return { data, isLoading, error };
};