<template>
    <div class="page page-upvote">
        <top-nav class="m-4 sm:m-8">
            <div v-if="editing" class="edit-profile-wrapper m-1 inline-block">
                <div class="inline-block">
                    <a class="paragraph-link mr-3" @click="cancel()">
                        Cancel
                    </a>
                    <a class="btn px-5 py-2" @click="save()" v-shortkey="['meta', 'enter']" @shortkey="save()">Save</a>
                </div>
            </div>
        </top-nav>
        <section class="hero text-center max-w-lg m-4 mx-auto">
            <div class="avatar">
                <router-link :to="{ path: '/' + upvote.tagged_username }">
                    <img :src="upvote.tagged_user_avatar"
                         class="w-16 sm:w-32 h-16 sm:h-32 rounded-full border-4 border-secondary-light
                         hover:border-secondary"
                    >
                </router-link>
            </div>
            <div class="inline-block" @click="editIfOwner()" >
                {{ this.upvote.headline }}
            </div>
        </section>
        <section class="mx-auto p-4 max-w-sm text-md">
            <div class="card mb-8">
                <div class="card--inner text-left p-4 leading-normal">
                    <div v-if="editing">
                        <textarea ref="message" class="width-100" rows="30">{{ upvote.message }}</textarea>
                    </div>
                    <div v-else @click="editIfOwner()" v-html="markdown(upvote.message)">
                    </div>
                    <div class="inline-tag mt-2">{{ upvote.tag_name }}</div>
                    <div class="inline text-gray-light text-xs ml-1">
                        {{ upvote.created_at | moment("subtract", "6 hours") | moment('from') }}
                    </div>
                </div>
            </div>
            <div class="text-center mb-8">
                <router-link class="naked-link block" :to="{ path: '/' + upvote.author_username }">
                    <img class="w-8 h-8 rounded-full border-2 border-primary-lighter hover:border-primary"
                         v-bind:src="upvote.author_avatar">
                </router-link>
                <router-link class="naked-link block" :to="{ path: '/' + upvote.author_username }">
                    {{ upvote.author_firstname }}
                </router-link>
            </div>
            <div class="container text-center text-4xl text-gray-light">
                <!--<input type="hidden" v-model="message">-->
                <!--<a class="naked-link mr-3" href="javascript://"-->
                   <!--v-clipboard:copy="message"-->
                   <!--v-clipboard:success="linkedinShare"-->
                   <!--v-clipboard:error="onError"><i class="fab fa-linkedin"></i></a>-->
                <a class="naked-link" target="_blank" :href="twitterShareUrl">
                    <i class="fab fa-twitter"></i>
                </a>
            </div>
        </section>
        <hr class="mt-16 mb-16"/>
        <footer-component></footer-component>
        <keyboard-shortcuts></keyboard-shortcuts>
    </div>
</template>

<script>
    import TopNav from '~/components/TopNav.vue'
    import FooterComponent from '~/components/FooterComponent.vue'
    import KeyboardShortcuts from '~/components/KeyboardShortcuts'

    import showdown from 'showdown';

    export default {
        components: {
            TopNav, FooterComponent, KeyboardShortcuts
        },
        data() {
            return {
                upvote: {},
                editing: false,
                message: null,
            }
        },
        async asyncData({$axios, params}) {
            if (process.server) {
                let {data} = await $axios.get('upvotes/' + params.id);
                return {upvote: data};
            }
        },
        mounted() {
            window.addEventListener('keyup', this.hotkeys);

            if (this.$route.query.editing) {
                this.editing = true;
                this.$nextTick(() => {
                    this.$refs.message.focus();
                });
            }

            this.$axios.get(this.$api('upvotes/' + this.$route.params.id)).then((response) => {
                this.upvote = response.data;
                this.message = this.linkedinShareContent();
            });
        },
        head() {
            return {
                title: "Shout-out to " + this.upvote.tagged_user_firstname + " from " + this.upvote.author_firstname,
                meta: this.$metaTags(
                    "Shout-out to " + this.upvote.tagged_user_firstname + " from " + this.upvote.author_firstname,
                    this.upvote.message ? this.upvote.message.substring(0, 200) : null,
                    this.cardImage
                )
            };
        },
        methods: {
            hotkeys(e) {
                if (e.key === 'Escape') {
                    this.editing = false;
                }
            },
            markdown: function (content) {
                let converter = new showdown.Converter();
                return converter.makeHtml(content);
            },
            linkedinShare() {
                this.$toasted.show('Copied message to clipboard. Opening LinkedIn share window now.');
                setTimeout(() => {
                    let url = 'https://www.linkedin.com/shareArticle?mini=true&url=' + window.location.href;
                    window.open(url);
                }, 1000);
            },
            linkedinShareContent() {
                let hashtag = this.upvote.tag_slug ? this.upvote.tag_slug.replace('-', '') : null;
                return "I just gave @" + this.upvote.tagged_user_firstname + " some props:\r\n\r\n" +
                    '"' + this.shortenedMessage + '"' + "\r\n\r\n" +
                    window.location.href + "\r\n\r\n" +
                    '#' + hashtag;
            },
            editIfOwner() {
                if (!this.loggedInUser.id) {
                    return;
                }

                if (this.loggedInUser.id !== this.upvote.author_id) {
                    return;
                }

                this.editing = true;
                this.$nextTick(() => {
                    this.$refs.message.focus();
                });
            },
            cancel() {
                this.editing = false;
            },
            save() {
                this.editing = false;
                this.upvote.message = this.$refs.message.value;

                this.$axios.post(this.$api("upvotes/" + this.upvote.id), {
                    'message': this.upvote.message
                }).then((response) => {
                    this.$toasted.show('Saved your shout-out');
                    this.user = response.data;
                });
            },
        },
        computed: {
            cardImage() {
                return 'https://image.thum.io/get/viewportWidth/900/viewportHeight/450/width/900/noanimate/' +
                    '?url=' + encodeURIComponent(process.env.CARD_BASE_URL + '/upvotes/' + this.upvote.id + '/twitter-card?v2');
            },
            loggedInUser() {
                return this.$cookies.get('user');
            },
            twitterShareUrl() {
                let hashtag = this.upvote.tag_slug ? this.upvote.tag_slug.replace('-', '') : null;
                let url = process.env.APP_URL + 'upvotes/' + this.upvote.id;

                let name = this.upvote.tagged_twitter_username ? ('@' + this.upvote.tagged_twitter_username) :
                    this.upvote.tagged_user_firstname;

                let text = "I just gave " + name + " some props:\r\n\r\n" +
                    '"' + this.shortenedMessage + '"' + "\r\n\r\n" +
                    url + "\r\n\r\n" +
                    '#' + hashtag;

                return 'https://twitter.com/intent/tweet?text=' + encodeURIComponent(text);
            },
            shortenedMessage() {
                let n = 180;
                if (!this.upvote.message) {
                    return null;
                }

                if (this.upvote.message.length <= n) {
                    return this.upvote.message;
                }

                let subString = this.upvote.message ? this.upvote.message.substr(0, n - 1) : "";
                return subString.substr(0, subString.lastIndexOf(' ')) + "...";
            }
        },
    }
</script>
