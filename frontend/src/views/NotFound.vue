<template>
  <div class="not-found">
    <h1>404</h1>
    <p>Lo sentimos, la página que estás buscando no existe.</p>
    <router-link to="/">Volver al Inicio</router-link>
  </div>
</template>
<style scoped>
.not-found { text-align: center; padding: 5rem 1rem; }
h1 { font-size: 4rem; color: #64748b; }
p { margin: 1rem 0 1.5rem 0; color: #94a3b8; }
a { color: #2563eb; text-decoration: none; font-weight: bold; }
</style>
