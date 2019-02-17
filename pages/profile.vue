<template>
    <div class="page page-profile" :class="{ 'can-edit' : canEdit }">
        <top-nav class="m-4 sm:m-8" :user="user">
            <div v-if="editing" class="edit-profile-wrapper m-1 inline-block">
                <div class="inline-block mr-3">
                    <a class="paragraph-link mr-3" @click="cancelEditing()" >
                        Cancel
                    </a>
                    <a class="btn px-5 py-2" @click="save">Save</a>
                </div>
            </div>
            <div v-if="canEdit && !editing">
                <div class="mr-6" @click="editing=1">
                    <i class="material-icons font-120 cursor-pointer">edit</i>
                </div>
            </div>
        </top-nav>
        <section class="header max-w-lg mx-auto text-center">
            <div class="m-4">
                <div class="avatar inline-block mb-1 relative">
                    <img v-bind:src="user.avatar_path" class="w-16 sm:w-32 h-16 sm:h-32 rounded-full">
                    <!--<i v-if="this.isPresent(user)" class="absolute is-present fas fa-circle"></i>-->
                </div>
                <input ref="avatar_path" v-if="editing" v-model="user.avatar_path" class="p-2 block mx-auto w-128"
                       placeholder="e.g. path to avatar">
                <input ref="name" v-if="editing" v-model="user.name" class="p-2 block mx-auto w-128"
                       placeholder="e.g. Jane Smith">
                <h1 ref="headline" class="text-xl sm:text-4xl editable animated"
                    v-bind:contenteditable="canEdit" @focus="editing=true">
                    {{ user.headline }}
                </h1>
            </div>
        </section>
        <section class="mx-auto max-w-md text-center">
            <div class="m-4">
                <!--<user-profile-tags :user="user" :editing="editing"></user-profile-tags>-->
            </div>
        </section>
        <div class="section mx-auto max-w-md text-md" v-if="user.about || editing">
            <div class="card m-4">
                <div class="card--inner text-left p-4">
                    <div class="editable-about" v-if="editing">
                        <textarea ref="about" class="font-90 width-100">{{ user.about }}</textarea>
                    </div>
                    <div v-else v-html="markdown(this.user.about)" @click="editIfOwner()"></div>
                </div>
            </div>
        </div>
        <hr v-if="hasUpvotes" class="m-6 sm:my-16 sm:w-md sm:mx-auto"/>
        <section v-if="hasUpvotes" class="endorsements mx-auto p-4 max-w-sm text-sm leading-tight">
            <div class="card hoverable endorsement-card mb-4" v-for="upvote in user.upvotes" :key="upvote.id">
                <div class="card--inner p-4 flex">
                    <div class="avatar centered text-center -ml-3">
                        <router-link :to="{ path: '/' + upvote.author_username }">
                            <img v-bind:src="upvote.author_avatar" class="w-8 h-8 rounded-full">
                        </router-link>
                    </div>
                    <div class="endorsement-message flex-4 sm:flex-6">
                        <div>
                            <div v-if="upvote.message" class="mb-2" v-html="markdown(upvote.message)"></div>
                            <div v-else class="mb-2">{{ upvote.author_firstname }} upvoted</div>
                            <div class="inline-tag">{{ upvote.tag_name }}</div>
                            <div class="inline text-gray-light">
                                <!--<router-link class="naked-link text-xs ml-1"-->
                                             <!--:to="{name: 'upvote', params: {id: upvote.id}}">-->
                                    <!--&lt;!&ndash;{{ upvote.created_at | moment("subtract", "6 hours") | moment('from') }}&ndash;&gt;-->
                                <!--</router-link>-->
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
        <section class="mt-16 text-center text-4xl text-gray-light">
            <a class="naked-link mr-3" target="_blank" :href="linkedInUrl">
                <i class="fab fa-linkedin"></i>
            </a>
        </section>


        <!--<chat-wrapper :user="user"></chat-wrapper>-->
        <hr class="mt-16 mb-16"/>
        <!--<keyboard-shortcuts></keyboard-shortcuts>-->
        <!--<footer-component :user="user"></footer-component>-->
    </div>
</template>

<script>
    import TopNav from '~/components/TopNav.vue'
    import axios from 'axios'

    export default {
        components: {
            TopNav
        },
        data() {
            return {
                user: {},
                editing: false,
                messages: [],
            }
        },
        async asyncData({params}) {
            if (process.server) {
                let url = process.env.API_URL + 'users/' + params.username;
                let { data } = await axios.get(url);
                return { user: data };
            }
        },
        mounted() {
            window.addEventListener('keyup', this.hotkeys);

            this.$axios.get(this.api + '/users/' + this.$route.params.username + this.auth).then((response) => {
                this.user = response.data;
            });

            // window.Events.$on('upvote-added', (upvote, allUpvotes) => {
            //     this.user.upvotes = allUpvotes;
            // });
            // window.Events.$on('upvote-removed', (upvote, allUpvotes) => {
            //     this.user.upvotes = allUpvotes;
            // });
        },
        methods: {
            editIfOwner() {
                if (this.canEdit) {
                    this.editing = true;
                    this.$nextTick(() => {
                        this.$refs.headline.focus();
                    });
                }
            },
            cancelEditing() {
                this.editing = false;
            },
            save() {
                this.editing = false;
                this.user.about = this.$refs.about.value;
                this.user.headline = this.$refs.headline.innerText;
                // Don't need to set avatar_path or name because of v-model

                this.$toast.show('Saved profile!', {duration: 5000, position: "bottom-right"});

                this.$axios.post(this.api + "/users/" + this.user.username + this.auth, {
                    'data': this.user
                });
            },
            markdown: function (content) {
                return content;
                // let converter = new showdown.Converter();
                // return converter.makeHtml(content);
            },
            hotkeys(e) {
                if (document.activeElement.tagName === 'BODY') {
                    if (e.key === 'i') {
                        window.location = '/admin/impersonate/' + this.user.username;
                    }
                    if (e.key === 'e') {
                        this.editIfOwner();
                    }
                }
            },
            // isPresent(user) {
            //     let ids = [];
            //     let presentUsers = this.presentUsers;
            //     for (let i in presentUsers) {
            //         ids.push(presentUsers[i].id);
            //     }
            //     return ids.includes(user.id);
            // },
        },
        computed: {
            hasUpvotes: function () {
                return this.user.upvotes && this.user.upvotes.length;
            },
            api() {
                return 'https://local.pros.global.test/api/v1';
            },
            auth() {
                return '?api_token=' + this.loggedInUser.api_token;
            },
            loggedIn() {
                return this.$store.state.user && this.$store.state.user.id;
            },
            loggedInUser: function() {
                return this.$store.state.user;
            },
            // presentUsers() {
            //     return this.$store.state.presentUsers;
            // },
            canEdit() {
                if (! this.loggedIn) {
                    return false;
                }

                if (this.loggedInUser.is_admin) {
                    return true;
                }

                return (this.loggedInUser.id === this.user.id);
            },
            unreadNotificationCount() {
                return this.$store.state.unreadNotificationCount;
            },
            linkedInUrl() {
                return 'https://www.linkedin.com/search/results/all/?keywords=' + this.user.name;
            }
        },
        metaInfo () {
            let notificationCount = this.unreadNotificationCount ? '(' + this.unreadNotificationCount + ') ' : '';
            return {
                title: notificationCount + this.user.name + " | pros.global",
            }
        },
    }
</script>