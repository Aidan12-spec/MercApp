<script setup>
import { ref } from 'vue';
import { useCartStore } from '../stores/cart';

const cartStore = useCartStore();
const orderPlaced = ref(false);

function handleCheckout() {
  orderPlaced.value = true;
  
  cartStore.items = [];
  localStorage.setItem('mercapp_cart', JSON.stringify([]));
}
</script>

<template>
  <div class="cart-container">
    <h2>Tu Carrito de Compras</h2>

    <div v-if="orderPlaced" class="success-box">
      <div class="success-icon">🎉</div>
      <h3>¡Pedido Procesado con Éxito!</h3>
      <p>Tu pedido ha sido completado en la simulación de MercApp.</p>
      <router-link to="/" class="btn-shop">Volver al Catálogo</router-link>
    </div>

    <div v-else-if="cartStore.items.length === 0" class="empty-cart">
      <p>No tienes productos en el carrito todavía.</p>
      <router-link to="/" class="btn-shop">Ir a buscar productos</router-link>
    </div>

    <div v-else class="cart-content">
      <div class="cart-items-list">
        <div v-for="item in cartStore.items" :key="item.id" class="cart-item">
          <img :src="item.imageUrl" :alt="item.name" class="item-img" />
          <div class="item-details">
            <h4>{{ item.name }}</h4>
            <p class="item-price">${{ item.price }} c/u</p>
            
            <div class="quantity-controls">
              <label>Cantidad:</label>
              <input 
                type="number" 
                :value="item.quantity" 
                @change="(e) => cartStore.updateQuantity(item.id, Number(e.target.value))"
                min="1" 
                :max="item.stock"
                class="qty-input"
              />
            </div>
          </div>
          <button @click="cartStore.removeFromCart(item.id)" class="btn-remove" title="Eliminar producto">🗑️</button>
        </div>
      </div>

      <div class="cart-summary">
        <h3>Resumen del Pedido</h3>
        <div class="summary-row">
          <span>Productos totales:</span>
          <span>{{ cartStore.totalProductsCount }}</span>
        </div>
        <div class="summary-row total">
          <span>Total a pagar:</span>
          <span>${{ cartStore.totalPrice }}</span>
        </div>
        <button @click="handleCheckout" class="btn-checkout">Proceder al Pago</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.cart-container { max-width: 1000px; margin: 2rem auto; padding: 0 1rem; }
h2 { margin-bottom: 1.5rem; }

.empty-cart, .success-box { text-align: center; padding: 4rem 1rem; background: white; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.05); }
.success-box { border-top: 5px solid #16a34a; }
.success-icon { font-size: 3.5rem; margin-bottom: 1rem; }
.success-box h3 { color: #16a34a; margin-bottom: 0.5rem; }
.success-box p { color: #64748b; margin-bottom: 1.5rem; }

.btn-shop { display: inline-block; background: #2563eb; color: white; text-decoration: none; padding: 0.6rem 1.2rem; border-radius: 6px; font-weight: bold; }

.cart-content { display: flex; flex-direction: column; gap: 1.5rem; }
@media (min-width: 768px) {
  .cart-content { flex-direction: row; align-items: flex-start; }
  .cart-items-list { flex: 2; }
  .cart-summary { flex: 1; }
}

.cart-item { background: white; padding: 1rem; border-radius: 8px; display: flex; align-items: center; gap: 1rem; margin-bottom: 1rem; box-shadow: 0 2px 4px rgba(0,0,0,0.05); }
.item-img { width: 70px; height: 70px; object-fit: cover; border-radius: 6px; }
.item-details { flex-grow: 1; }
.item-price { color: #64748b; font-size: 0.9rem; margin: 0.2rem 0; }
.qty-input { width: 60px; padding: 0.25rem; margin-left: 0.5rem; border: 1px solid #cbd5e1; border-radius: 4px; }
.btn-remove { background: none; border: none; font-size: 1.2rem; cursor: pointer; padding: 0.5rem; }

.cart-summary { background: white; padding: 1.5rem; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.05); position: sticky; top: 80px; }
.summary-row { display: flex; justify-content: space-between; margin-bottom: 0.75rem; color: #475569; }
.total { font-weight: bold; font-size: 1.2rem; color: #1e293b; border-top: 1px solid #e2e8f0; padding-top: 0.75rem; }
.btn-checkout { width: 100%; background: #16a34a; color: white; border: none; padding: 0.75rem; border-radius: 6px; font-size: 1rem; font-weight: bold; cursor: pointer; margin-top: 1rem; transition: background 0.2s; }
.btn-checkout:hover { background: #15803d; }
</style>
