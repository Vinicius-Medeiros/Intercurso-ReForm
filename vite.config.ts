import { defineConfig} from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(() => {


  return {
    plugins: [react()],
    server: {
      proxy: {
        '/receitaWS': {
          target: 'https://receitaws.com.br/v1/cnpj',
          changeOrigin: true,
          secure: true,
          rewrite: path => path.replace(/^\/receitaWS/, ''),
        },
      },
    },
  }
})
