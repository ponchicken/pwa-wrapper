import basicSsl from '@vitejs/plugin-basic-ssl'
import dns from 'dns'

dns.setDefaultResultOrder('verbatim')

/** @type {import('vite').UserConfig} */
export default {
  server: {
    port: 80,
  }
}
