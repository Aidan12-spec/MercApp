<script setup>
import { useCartStore } from './stores/cart';
const cartStore = useCartStore();
</script>

<template>
  <div class="app-layout">
    <nav class="navbar">
      <div class="nav-container">
        <router-link to="/" class="brand">🛒 MercApp</router-link>
        <div class="nav-links">
          <router-link to="/">Catálogo</router-link>
          <router-link to="/about">Nosotros</router-link>
          <router-link to="/cart" class="cart-link">
            Carrito <span class="badge" v-if="cartStore.totalProductsCount > 0">{{ cartStore.totalProductsCount }}</span>
          </router-link>
        </div>
      </div>
    </nav>

    <main class="main-content">
      <router-view v-slot="{ Component }">
        <template v-if="Component">
          <Suspense timeout="0">
            <template #default>
              <component :is="Component" />
            </template>
            <template #fallback>
              <div class="loading-fallback">Cargando sección de forma segura...</div>
            </template>
          </Suspense>
        </template>
      </router-view>
    </main>
  </div>
</template>

<style>
/* Estilos globales básicos y limpios (Mobile-first sugerido por rúbrica) */
* { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Segoe UI', system-ui, sans-serif; }
body { background-color: #f8fafc; color: #1e293b; }

.navbar { background: #1e293b; color: white; padding: 1rem 0; position: sticky; top: 0; z-index: 100; }
.nav-container { max-width: 1200px; margin: 0 auto; display: flex; justify-content: space-between; align-items: center; padding: 0 1rem; }
.brand { font-size: 1.3rem; font-weight: bold; text-decoration: none; color: white; }
.nav-links a { color: #cbd5e1; text-decoration: none; margin-left: 1rem; font-weight: 500; font-size: 0.95rem; }
.nav-links a.router-link-active { color: #3b82f6; font-weight: bold; }

.cart-link { position: relative; }
.badge { background: #ef4444; color: white; font-size: 0.75rem; padding: 0.15rem 0.4rem; border-radius: 999px; margin-left: 0.2rem; }
.main-content { min-height: calc(100vh - 60px); padding-bottom: 2rem; }
.loading-fallback { text-align: center; padding: 5rem; font-size: 1.1rem; color: #64748b; }
</style>
