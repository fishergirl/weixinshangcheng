const path = require('path')
export default {
  alias: {
    src: path.resolve(__dirname, 'src'),
    components: path.resolve(__dirname, 'src/components'),
    utils: path.resolve(__dirname, 'src/utils'),
    services: path.resolve(__dirname, 'src/services'),
    models: path.resolve(__dirname, 'src/models'),
    themes: path.resolve(__dirname, 'src/themes'),
    images: path.resolve(__dirname, 'src/assets')
  },
  "define": {
    'process.env': {
      'NODE_ENV': process.env.NODE_ENV
    },
  },
  "proxy": {
    "/api": {
      "target": "http://192.168.2.217:10310",
      "changeOrigin": true,
    },
    "/login": {
      "target": "http://192.168.2.217:10310",
      "changeOrigin": true,
    },
    "/cool-weixin-service": {
      "target": "http://192.168.2.217:10310",
      "changeOrigin": true,
    },
    "/cool-system": {
      "target": "http://192.168.2.217:10310",
      "changeOrigin": true,
    },
    "/cool-crm": {
      "target": "http://192.168.2.217:10310",
      "changeOrigin": true,
    },
    "/cool-sale-service": {
      "target": "http://192.168.2.217:10310",
      "changeOrigin": true,
    },
    "/cool-order": {
      "target": "http://192.168.2.217:10310",
      "changeOrigin": true,
    },
  }
}
