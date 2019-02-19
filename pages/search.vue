<template>
    <div class="page page-search">
        <top-nav class="m-4 sm:m-8"></top-nav>
        <section class="mb-6 max-w-md mx-auto">
            <div class="flex m-4 mt-6">
                <input ref="search"
                       v-model="query"
                       placeholder="e.g. tag:founder"
                       class="text font-100 flex-5 no-border mr-2 p-2"
                >
                <a class="btn flex-1 px-5 py-2 text-center" style="flex-basis: 50px; flex-grow: inherit;" @click="search">
                    <span v-if="search_processing">Searching...</span>
                    <span v-else>Search</span>
                </a>
                <a class="btn px-5 py-2 ml-2" @click="saveSearch"><i class="fas fa-save"></i></a>
            </div>
        </section>
        <section class="max-w-md mx-auto" v-bind:class="{opacity50 : search_processing}">
            <div v-if="users.length">
                <search-result-card class="hoverable mb-4"
                                    v-for="user in users" v-bind:user="user" :key="user.id"></search-result-card>
            </div>
            <div v-else>
                <div class="p-4 text-center">
                    <div class="italic mb-4 text-gray-dark">
                        No pros were found. Want to add someone you know from Twitter?
                    </div>
                    <div>
                        <input class="p-4 mr-4"
                               placeholder="e.g. @username"
                               ref="twitterUsername"
                        >
                        <a class="btn px-5 py-3" @click="addTwitterUser">
                            <i class="fab fa-twitter mr-1"></i>
                            Add
                        </a>
                    </div>
                </div>
            </div>
        </section>
        <hr class="mt-16 mb-16"/>
        <footer-component></footer-component>
        <keyboard-shortcuts></keyboard-shortcuts>
    </div>
</template>

<script>
    import FooterComponent from "../components/FooterComponent";
    import TopNav from '../components/TopNav';
    import SearchResultCard from '../components/SearchResultCard';
    import KeyboardShortcuts from '../components/KeyboardShortcuts';

    export default {
        components: {
            FooterComponent, TopNav, SearchResultCard, KeyboardShortcuts,
        },
        data() {
            return {
                users: [],
                search_processing: false,
                query: null,
            }
        },
        mounted() {
            window.addEventListener('keyup', this.hotkeys);
            if (this.$route.query.q) {
                this.query = this.$route.query.q;
                this.search();
            } else {
                this.$axios.get(this.$api('users')).then((response) => {
                    this.users = response.data;
                });
            }

            this.$refs.search.focus();
        },
        methods: {
            search() {
                this.search_processing = true;
                window.history.replaceState({}, null, '/search?q=' + this.query);

                this.$axios.get(this.$api('users?q=' + this.query)).then((response) => {
                    this.search_processing = false;
                    this.users = response.data;
                });
            },
            saveSearch() {
                let name = prompt("Name for saved search");
                if (!name) {
                    return;
                }

                this.$axios.post(this.$api('/api/v1/saved-searches'), {
                    'name': name,
                    'query': this.$refs.search.value,
                }).then((response) => {
                    this.$toasted.show("" +
                        "Saved search: <a class='paragraph-link' href='/s/" + response.data.id + "'>" + name + "</a>" +
                        "");
                });
            },
            hotkeys(e) {
                if (document.activeElement.tagName === 'INPUT') {
                    if (e.key === 'Enter') {
                        this.search();
                    } else if (e.key === 'Escape') {
                        this.$refs.search.blur();
                    }
                } else if (document.activeElement.tagName === 'BODY') {
                    if (e.key === '/') {
                        this.$refs.search.focus();
                    }
                }
            },
            addTwitterUser() {
                if (!this.loggedIn) {
                    return alert('Please login first');
                }

                this.$axios.get(this.$api('twitter/add-user/' + this.$refs.twitterUsername.value)).then((response) => {
                    if (response.data.username) {
                        this.$router.push({
                            path: '/' + response.data.username,
                        });
                    } else if (response.data.message) {
                        alert(response.data.message);
                    }
                });
            },
        },
        computed: {
            loggedIn() {
                return this.$store.state.user && this.$store.state.user.id;
            },
            loggedInUser() {
                return this.$store.state.user;
            },
        },
        metaInfo() {
            return {
                title: this.unreadNotificationCount ? '(' + this.unreadNotificationCount + ') ' : '' +
                    "Search for " + " " + this.query
                    + " | pros.global",
            }
        },
    }
</script>
