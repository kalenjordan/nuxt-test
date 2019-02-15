<template>
    <div class="page-home">
        <!--<top-nav class="m-4 sm:m-8"></top-nav>-->
        <section class="header text-center max-w-lg mx-auto mb-4">
            <h1 id="typewriter" class="mx-4 text-2xl sm:text-4xl">
                {{ homeSavedSearch.name }}
            </h1>
        </section>
        <hr class="mt-16 mb-16"/>
        <section class="max-w-3xl mb-8 mt-8 mx-auto">
            <h2 class="text-center mx-auto mb-8">About</h2>
            <div class="font-120 mx-auto px-4" style="max-width: 40rem;">
                <p class="mb-4">
                    The goal of this platform is to facilitate various types of matchmaking. Having run a
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
    </div>
</template>

<script>
    // import Typewriter from 'typewriter-effect/dist/core';

    export default {
        data() {
            return {
                users: [],
                savedSearches: [],
                homeSavedSearch: {users: []},
            }
        },
        mounted() {
            this.$axios.get('https://local.pros.global.test/api/v1/saved-searches/home?with_users=1').then((response) => {
                this.homeSavedSearch = response.data;
            });
            this.$axios.get('https://local.pros.global.test/api/v1/saved-searches/home/related?with_users=1').then((response) => {
                this.savedSearches = response.data;
            });
            // let typewriter = new Typewriter('#typewriter', {
            //     loop: true
            // });
            //
            // typewriter.typeString('Connect with awesome founders.')
            //     .pauseFor(700)
            //     .deleteChars(9)
            //     .typeString('developers.')
            //     .pauseFor(700)
            //     .deleteChars(11)
            //     .typeString('eCommerce pros.')
            //     .pauseFor(700)
            //     .deleteChars(15)
            //     .start();
        },
        // computed: {
        //     loggedInUser: function () {
        //         return this.$store.state.user;
        //     },
        //     unreadNotificationCount() {
        //         return this.$store.state.unreadNotificationCount;
        //     },
        // },
        // metaInfo() {
        //     let notificationCount = this.unreadNotificationCount ? '(' + this.unreadNotificationCount + ') ' : '';
        //     return {
        //         title: notificationCount + window.app_name + " - Connect with awesome pros",
        //     }
        // },
    }
</script>
