import { ref } from 'vue';

export function useApi() {
  const data = ref(null);
  const loading = ref(false);
  const error = ref(null);

  const request = async (url, options = {}, retries = 1) => {
    loading.value = true;
    error.value = null;
    
    try {
      const response = await fetch(url, options);
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
