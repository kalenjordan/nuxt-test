const pkg = require('./package')
require('dotenv').config()

module.exports = {
    // mode: 'spa',

    /*
    ** Headers of the page
    */
    head: {
        title: process.env.APP_NAME,
        meta: [
            {charset: 'utf-8'},
            {name: 'viewport', content: 'width=device-width, initial-scale=1'},
            {hid: 'description', name: 'description', content: pkg.description}
        ],
        link: [
            {rel: 'icon', type: 'image/x-icon', href: process.env.FAVICON}
        ]
    },

    vue: {
        config: {
            productionTip: false,
        }
    },

    /*
    ** Customize the progress-bar color
    */
    loading: {color: '#fff'},

    /*
    ** Global CSS
    */
    css: [
        '~/assets/css/tailwind.css',
        '@/assets/scss/app.scss',
    ],

    /*
    ** Plugins to load before mounting the App
    */
    plugins: [
        '~/plugins/vue-instantsearch'
    ],

    /*
    ** Nuxt.js modules
    */
    modules: [
        'nuxt-material-design-icons',
        '@nuxtjs/dotenv',
        '@nuxtjs/toast',
        'cookie-universal-nuxt',
        '@nuxtjs/axios',
        '@nuxtjs/pwa'
    ],
    /*
    ** Axios module configuration
    */
    axios: {
        // See https://github.com/nuxt-community/axios-module#options
    }
    ,

    /*
    ** Build configuration
    */
    build: {
        /*
        ** You can extend webpack config here
        */
        extend(config, ctx) {
            // Run ESLint on save
            // if (ctx.isDev && ctx.isClient) {
            //   config.module.rules.push({
            //     enforce: 'pre',
            //     test: /\.(js|vue)$/,
            //     loader: 'eslint-loader',
            //     exclude: /(node_modules)/
            //   })
            // }
        }
    }
}
