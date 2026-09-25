import axios from 'axios';
import { Extracurricular } from '@/types';

// Create an Axios instance pointing to the Laravel backend
export const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api', // Make sure this matches your Laravel dev server URL
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Fetch all ekskuls from the backend API
export const getEkskulsAPI = async (): Promise<Extracurricular[]> => {
  try {
    const response = await api.get('/ekskul');
    return response.data;
  } catch (error) {
    console.error('Error fetching ekskuls from API:', error);
    return [];
  }
};

// Fetch a single ekskul by slug
export const getEkskulBySlugAPI = async (slug: string): Promise<Extracurricular | undefined> => {
  try {
    const response = await api.get(`/ekskul/${slug}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching ekskul ${slug}:`, error);
    return undefined;
  }
};
