import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useCartStore = defineStore('cart', () => {
  const items = ref(JSON.parse(localStorage.getItem('mercapp_cart')) || []);

  const totalProductsCount = computed(() => {
    return items.value.reduce((total, item) => total + item.quantity, 0);
  });

  const totalPrice = computed(() => {
    return items.value.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2);
  });

  function addToCart(product) {
    const existingItem = items.value.find(item => item.id === product.id);
    
    if (existingItem) {
      if (existingItem.quantity < product.stock) {
        existingItem.quantity++;
      } else {
        alert('Lo sentimos, no hay más stock disponible de este producto.');
      }
    } else {
      items.value.push({ ...product, quantity: 1 });
    }
    saveToLocalStorage();
  }

  function removeFromCart(productId) {
    items.value = items.value.filter(item => item.id !== productId);
    saveToLocalStorage();
  }

  function updateQuantity(productId, quantity) {
    const item = items.value.find(item => item.id === productId);
    if (item && quantity > 0 && quantity <= item.stock) {
      item.quantity = quantity;
      saveToLocalStorage();
    }
  }

  function saveToLocalStorage() {
    localStorage.setItem('mercapp_cart', JSON.stringify(items.value));
  }

  return { items, totalProductsCount, totalPrice, addToCart, removeFromCart, updateQuantity };
});
