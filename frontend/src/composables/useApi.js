import { ref } from 'vue';
import axios from 'axios';

const BASE_URL = 'https://mercapp-production-f0c7.up.railway.app';

const api = axios.create({
  baseURL: BASE_URL 
});
export default api;

export function useApi() {
  const data = ref(null);
  const loading = ref(false);
  const error = ref(null);

  const request = async (url, options = {}, retries = 1) => {
    loading.value = true;
    error.value = null;
    
    let finalUrl = url;
    if (finalUrl.includes('localhost:')) {
      finalUrl = finalUrl.replace(/http:\/\/localhost:\d+/, BASE_URL);
    } else if (!finalUrl.startsWith('http')) {
      finalUrl = `${BASE_URL}${finalUrl}`;
    }
    
    try {
      const response = await fetch(finalUrl, options);
      if (!response.ok) {
        throw new Error(`Error del servidor: ${response.status} ${response.statusText}`);
      }
      data.value = await response.json();
      return data.value;
    } catch (err) {
      if (retries > 0) {
        console.warn(`La petición ha fallado. Reintentando... (${retries} intento restante)`);
        return await request(url, options, retries - 1);
      }
      error.value = err.message || 'Error de conexión con el servidor';
    } finally {
      loading.value = false;
    }
  };

  return { data, loading, error, request };
}
