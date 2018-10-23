export default {
  hashHistory: true,
  plugins:[
    ['umi-plugin-dva'],
    ['umi-plugin-routes', {
      exclude: [
        /models/,
        /services/,
        /components/,
      ],
    }],
  ],
  // hd:true,
  pages: {
    '/': { Route: './routes/PrivateRoute.js' },
  },
  loading:'./src/pageLoading.js'
}
