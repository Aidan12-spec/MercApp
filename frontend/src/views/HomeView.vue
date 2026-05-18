<script setup>
import { onMounted, ref, computed } from 'vue';
import { useApi } from '../composables/useApi';
import { useCartStore } from '../stores/cart';

// Conectores de nuestra API simulada
const { data: products, loading: loadingProducts, error: errorProducts, request: fetchProducts } = useApi();
const { data: categories, request: fetchCategories } = useApi();

const cartStore = useCartStore();

// Estados reactivos para los filtros de la rúbrica
const searchQuery = ref('');
const selectedCategory = ref('');

onMounted(async () => {
  // Jalamos los datos desde nuestro backend en paralelo de forma asíncrona
  fetchProducts('http://localhost:3000/api/products');
  fetchCategories('http://localhost:3000/api/categories');
});

// Lógica de filtrado en tiempo real (Reactividad avanzada con Computed)
const filteredProducts = computed(() => {
  if (!products.value) return [];
  
  return products.value.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.value.toLowerCase()) || 
                          product.description.toLowerCase().includes(searchQuery.value.toLowerCase());
    const matchesCategory = !selectedCategory.value || product.categoryId === selectedCategory.value;
    
    return matchesSearch && matchesCategory;
  });
});
</script>

<template>
  <div class="catalog-container">
    <header class="catalog-header">
      <h1>Catálogo de Productos</h1>
      <p>Bienvenido a MercApp. Explora y gestiona tus compras en tiempo real.</p>
    </header>

    <section class="filters-bar">
      <input 
        type="text" 
        v-model="searchQuery" 
        placeholder="Buscar producto por nombre o descripción..." 
        class="search-input"
      />
      
      <select v-model="selectedCategory" class="category-select">
        <option value="">Todas las categorías</option>
        <option v-for="cat in categories" :key="cat.id" :value="cat.id">
          {{ cat.name }}
        </option>
      </select>
    </section>

    <div v-if="loadingProducts" class="status-msg">Cargando catálogo de forma segura...</div>
    <div v-else-if="errorProducts" class="status-msg error">⚠️ Error de conexión: {{ errorProducts }}</div>

    <div v-else class="products-grid">
      <div v-for="product in filteredProducts" :key="product.id" class="product-card">
        <div class="image-container">
          <img :src="product.imageUrl" :alt="product.name" class="product-img" />
          <span v-if="product.stock <= 0" class="sold-out-badge">Agotado</span>
        </div>
        
        <div class="product-info">
          <h3>{{ product.name }}</h3>
          <p class="product-desc">{{ product.description }}</p>
          
          <div class="product-footer">
            <span class="product-price">${{ product.price }}</span>
            <span class="product-stock">Stock: {{ product.stock }}</span>
          </div>

          <div class="card-actions">
            <router-link :to="`/product/${product.id}`" class="btn-detail">
              Ver Detalles
            </router-link>
            
            <button 
              @click="cartStore.addToCart(product)" 
              class="btn-add" 
              :disabled="product.stock <= 0"
            >
              ➕ Agregar
            </button>
          </div>
        </div>
      </div>

      <div v-if="filteredProducts.length === 0" class="no-results">
        No se encontraron productos que coincidan con tu búsqueda.
      </div>
    </div>
  </div>
</template>

<style scoped>
.catalog-container { max-width: 1200px; margin: 0 auto; padding: 2rem 1rem; }
.catalog-header { text-align: center; margin-bottom: 2rem; }
.catalog-header h1 { color: #1e293b; margin-bottom: 0.5rem; }
.catalog-header p { color: #64748b; }

.filters-bar { display: flex; flex-direction: column; gap: 1rem; margin-bottom: 2rem; }
@media (min-width: 600px) {
  .filters-bar { flex-direction: row; }
  .search-input { flex: 2; }
  .category-select { flex: 1; }
}

.search-input, .category-select { padding: 0.75rem; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 1rem; background: white; }
.search-input:focus, .category-select:focus { outline: 2px solid #3b82f6; }

.products-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1.5rem; }
.product-card { background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); display: flex; flex-direction: column; border: 1px solid #e2e8f0; transition: transform 0.2s; }
.product-card:hover { transform: translateY(-4px); }

.image-container { position: relative; width: 100%; height: 200px; background: #f1f5f9; }
.product-img { width: 100%; height: 100%; object-fit: cover; }
.sold-out-badge { position: absolute; top: 0.5rem; right: 0.5rem; background: #ef4444; color: white; padding: 0.25rem 0.6rem; font-size: 0.75rem; font-weight: bold; border-radius: 4px; }

.product-info { padding: 1.25rem; display: flex; flex-direction: column; flex-grow: 1; gap: 0.5rem; }
.product-info h3 { font-size: 1.15rem; color: #1e293b; }
.product-desc { font-size: 0.875rem; color: #64748b; line-height: 1.4; height: 40px; overflow: hidden; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; }

.product-footer { display: flex; justify-content: space-between; align-items: center; margin-top: auto; padding-top: 0.5rem; }
.product-price { font-size: 1.25rem; font-weight: bold; color: #16a34a; }
.product-stock { font-size: 0.8rem; color: #94a3b8; }

.card-actions { display: flex; gap: 0.5rem; margin-top: 0.75rem; }
.btn-detail { flex: 1; text-align: center; background: #f1f5f9; color: #475569; text-decoration: none; padding: 0.5rem; border-radius: 6px; font-weight: 500; font-size: 0.9rem; border: 1px solid #e2e8f0; }
.btn-detail:hover { background: #e2e8f0; }
.btn-add { flex: 1; background: #2563eb; color: white; border: none; padding: 0.5rem; border-radius: 6px; font-weight: bold; cursor: pointer; font-size: 0.9rem; }
.btn-add:hover:not(:disabled) { background: #1d4ed8; }
.btn-add:disabled { background: #cbd5e1; cursor: not-allowed; }

.status-msg { text-align: center; padding: 4rem; color: #64748b; font-size: 1.1rem; }
.error { color: #ef4444; }
.no-results { grid-column: 1 / -1; text-align: center; padding: 3rem; color: #94a3b8; }
</style>
