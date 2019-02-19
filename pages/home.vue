<template>
    <div class="page-home">
        <top-nav class="m-4 sm:m-8"></top-nav>
        <section class="header text-center max-w-lg mx-auto mb-4">
            <h1 id="typewriter" class="mx-4 text-2xl sm:text-4xl">
                {{ homeSavedSearch.name }}
            </h1>
        </section>
        <section class="max-w-2xl mb-8 mx-auto">
            <div class="user-cards m-2 mb-4 sm:mb-8 flex flex-wrap justify-center">
                <user-card class="hoverable w-full sm:max-w-xs m-2"
                           v-for="user in homeSavedSearch.users.slice(0, 6)"
                           :user="user" :key="user.id"
                ></user-card>
            </div>
            <div class="centered">
                <router-link v-if="homeSavedSearch.query" class="btn px-5 py-2 bold"
                             :to="{ path: '/search?q=' + homeSavedSearch.query }">
                    See more
                    <i class="material-icons align-middle" style="margin-right: -7px;">keyboard_arrow_right</i>
                </router-link>
            </div>
        </section>

        <hr class="mt-16 mb-16"/>
        <section class="max-w-3xl mb-8 mx-auto">
            <div class="saved-searches m-2 mb-4 sm:mb-8 flex flex-wrap justify-center">
                <saved-search-card class="mb-12 m-4" v-for="savedSearch in savedSearches" :key="savedSearches.id"
                                   :savedSearch="savedSearch"
                                   ></saved-search-card>
            </div>
        </section>

        <hr class="mt-16 mb-16"/>
        <section class="max-w-3xl mb-8 mt-8 mx-auto">
            <h2 class="text-center mx-auto mb-8">About</h2>
            <div class="font-120 mx-auto px-4" style="max-width: 40rem;">
                <p class="mb-4">
                    This platform is to facilitate various types of matchmaking. Having run a
                    <a href="https://commercehero.io">matchmaking platform</a> in a specific eCommerce developer niche successfully
                    for the last 2 years, I'm taking some of the learnings from that, and trying to create an offering that's a little bit more broad and flexible.
                </p>
                <p class="mb-4">
                    I'm not exactly sure what audiences will be best served by this, but currently the platform is being seeded with people in the communities that I'm most connected to—eCommerce professionals, developers, and bootstrapped software founders.
                </p>
                <p class="mb-4">
                    As the number of people on the platform grows, the value that we can provide in matchmaking for the purposes of hiring employees, contractors, or even finding a co-founder, advisor, or investor should improve.
                </p>
                <p class="mb-4">
                    If you have any questions, I'd love to
                    <a href="https://twitter.com/kalenjordan">hear from you</a>!
                </p>
            </div>
        </section>
        <hr class="mt-16 mb-16"/>
        <footer-component></footer-component>
        <keyboard-shortcuts></keyboard-shortcuts>
    </div>
</template>

<script>
    import TopNav from '~/components/TopNav.vue'
    import UserCard from '~/components/UserCard.vue'
    import SavedSearchCard from '~/components/SavedSearchCard.vue'
    import FooterComponent from '~/components/FooterComponent.vue'
    import KeyboardShortcuts from '~/components/KeyboardShortcuts';

    let Typewriter;
    if (process.browser) {
        Typewriter = require('typewriter-effect/dist/core')
    }

    import axios from 'axios'

    export default {
        components: {
            TopNav, UserCard, SavedSearchCard, FooterComponent, KeyboardShortcuts
        },
        data() {
            return {
                savedSearches: [],
                homeSavedSearch: {users: []},
            }
        },
        async asyncData() {
            if (! process.server) {
                return {homeSavedSearch: {users: []}};
            }

            let url = process.env.API_URL + 'saved-searches/home?with_users=1';
            return axios.get(url)
                .then((response) => {
                    return {
                        homeSavedSearch: response.data,
                    }
                })
        },
        head() {
            return {
                title: process.env.APP_NAME + " - Connect with awesome pros",
                meta: [
                    {
                        hid: 'description',
                        name: 'description',
                        content: "Connect with awesome founders, developers, and eCommerce professionals",
                    },
                ]
            }
        },
        mounted() {
            this.$axios.get(this.$api('saved-searches/home?with_users=1')).then((response) => {
                this.homeSavedSearch = response.data;
            });
            this.$axios.get(this.$api('saved-searches/home/related?with_users=1')).then((response) => {
                this.savedSearches = response.data;
            });

            if (process.browser) {
                this.initTypewriter();
            }
        },
        methods: {
            initTypewriter() {
                let typewriter = new Typewriter('#typewriter', {
                    loop: true
                });

                typewriter.typeString('Connect with awesome founders.')
                    .pauseFor(700)
                    .deleteChars(9)
                    .typeString('developers.')
                    .pauseFor(700)
                    .deleteChars(11)
                    .typeString('eCommerce pros.')
                    .pauseFor(700)
                    .deleteChars(15)
                    .start();
            },
        },
        computed: {
            loggedInUser: function () {
                return this.$store.state.user;
            },
            unreadNotificationCount() {
                return this.$store.state.unreadNotificationCount;
            },
        },
    }
</script>
