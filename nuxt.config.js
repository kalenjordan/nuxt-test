const pkg = require('./package')
require('dotenv').config()

module.exports = {
    // mode: 'spa',

    server: {
        port: 3000, // default: 3000
        host: '0.0.0.0', // default: localhost
    },

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
            {rel: 'icon', type: 'image/x-icon', href: process.env.FAVICON},
            {rel: 'stylesheet', href: 'https://use.fontawesome.com/releases/v5.7.2/css/all.css'},
        ],
    },

    vue: {
        config: {
            productionTip: false,
        }
    },

    /*
    ** Customize the progress-bar color
    */
    loading: false,

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
        '~/plugins/vue-instantsearch',
        '~/plugins/vue-js-modal',
        '~/plugins/vue-moment',
        '~/plugins/vue-inject',
        { src: '~plugins/ga.js', ssr: false },
        '~/plugins/axios',
    ],

    /*
    ** Nuxt.js modules
    */
    modules: [
        '@nuxtjs/sentry',
        '@nuxtjs/component-cache',
        '@nuxtjs/vuetify',
        '@nuxtjs/dotenv',
        '@nuxtjs/toast',
        '@nuxtjs/axios',
        '@nuxtjs/pwa',
        'nuxt-material-design-icons',
        'cookie-universal-nuxt',
    ],

    sentry: {
        dsn: process.env.SENTRY_DSN,
        config: {}, // Additional config
    },

    toast: {
        position: 'bottom-right',
        duration: 5000,
    },

    vuetify: {
        materialIcons: false,
        css: false,
    },

    axios: {
        // none
    },

    router: {
        extendRoutes (routes, resolve) {
            routes.push({
                //name: 'home', // don't want to name it this b/c it collides with default name based on filename home.vue
                path: '/',
                component: resolve(__dirname, 'pages/home.vue')
            });
            routes.push({
                // name: 'saved-search',
                path: '/s/:slug',
                component: resolve(__dirname, 'pages/saved-search.vue')
            });
            routes.push({
                // name: 'profile',
                path: '/:username',
                component: resolve(__dirname, 'pages/profile.vue')
            });
            routes.push({
                // name: 'tag',
                path: '/tag/:slug',
                component: resolve(__dirname, 'pages/tag.vue')
            });
            routes.push({
                // name: 'upvote',
                path: '/upvotes/:id',
                component: resolve(__dirname, 'pages/upvote.vue')
            });
        },
    },

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
