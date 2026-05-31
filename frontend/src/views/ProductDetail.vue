<script setup>
import { onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useApi } from '../composables/useApi';
import { useCartStore } from '../stores/cart';

const route = useRoute();
const router = useRouter();
const cartStore = useCartStore();
const { data: product, loading, error, request: fetchProduct } = useApi();

onMounted(() => {
  fetchProduct(`https://mercapp-production-f0c7.up.railway.app/api/products/${route.params.id}`);
});
</script>

<template>
  <div class="detail-container">
    <button @click="router.back()" class="btn-back">← Volver al catálogo</button>

    <div v-if="loading" class="state-msg">Cargando detalles del producto...</div>
    <div v-else-if="error" class="state-msg error">Error: {{ error }}</div>
    
    <div v-else-if="product" class="detail-card">
      <img :src="product.imageUrl" :alt="product.name" class="detail-image" />
      <div class="detail-info">
        <h2>{{ product.name }}</h2>
        <span class="price-tag">${{ product.price }}</span>
        <p class="description">{{ product.description }}</p>
        <p class="stock-info">Stock disponible: <strong>{{ product.stock }} unidades</strong></p>
        
        <button 
          @click="cartStore.addToCart(product)" 
          class="btn-add-cart"
          :disabled="product.stock <= 0"
        >
          {{ product.stock > 0 ? 'Añadir al Carrito' : 'Agotado Temporalmente' }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.detail-container { max-width: 800px; margin: 2rem auto; padding: 0 1rem; }
.btn-back { background: none; border: none; color: #2563eb; cursor: pointer; font-size: 1rem; margin-bottom: 1rem; }
.detail-card { background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); display: flex; flex-direction: column; }

@media (min-width: 600px) {
  .detail-card { flex-direction: row; }
  .detail-image { width: 50%; max-height: 400px; object-fit: cover; }
  .detail-info { width: 50%; padding: 2rem; }
}

.detail-image { width: 100%; height: 250px; object-fit: cover; }
.detail-info { padding: 1.5rem; display: flex; flex-direction: column; gap: 1rem; }
.price-tag { font-size: 1.5rem; font-weight: bold; color: #16a34a; }
.description { color: #475569; line-height: 1.5; }
.stock-info { font-size: 0.95rem; color: #64748b; }
.btn-add-cart { background: #2563eb; color: white; border: none; padding: 0.75rem; border-radius: 6px; font-size: 1rem; font-weight: bold; cursor: pointer; width: 100%; transition: background 0.2s; }
.btn-add-cart:hover:not(:disabled) { background: #1d4ed8; }
.btn-add-cart:disabled { background: #cbd5e1; cursor: not-allowed; }
.state-msg { text-align: center; padding: 3rem; color: #64748b; }
.error { color: #ef4444; }
</style>
