// import { defineConfig } from 'vite';
// import react from '@vitejs/plugin-react';

// export default defineConfig({
//   plugins: [react()],
//   esbuild: {
//     loader: 'jsx',
//     include: /src\/.*\.js$/
//   },
//   server: {
//     port: 3000,          // ← dev port you prefer
//     // open: true           // optionally auto-opens browser
//   }
// });





// client/vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: { port: 3000 },
  esbuild: {
    loader: 'jsx',
    include: /src\/.*\.[jt]sx?$/
  }
});
