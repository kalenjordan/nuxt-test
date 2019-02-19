<template>
    <div style="display: inline-block">
        <div class="tag tag-with-upvote border-1 fast text-sm sm:text-base">
            <router-link class="tag-name animated" :to="{ path: '/tag/' + tag.slug }">
                <template v-if="tag.icon"><i class="material-icons">{{ tag.icon }}</i></template>
                {{ tag.name }}
            </router-link>
            <span class="separator">&nbsp;</span>
            <span class="count-and-upvote animated" @click="tagClick(tag)">
                <span class="tag-count" v-if="tag.upvote_count">{{ tag.upvote_count }}</span>
                <i class="material-icons upvote-icon" :class="{upvoted : tag.is_upvoted_by_me}">thumb_up</i>
            </span>

        </div>
    </div>
</template>

<script>
    export default {
        props: ['user', 'tag', 'editing'],
        data() {
            return {
                hasBeenClicked: false,
            }
        },
        methods: {
            tagClick(tag) {
                if (! this.loggedInUser.id) {
                    return alert('Please login before you can upvote someone');
                }

                this.hasBeenClicked = true;
                if (tag.is_upvoted_by_me) {
                    tag.upvote_count -= 1;
                } else {
                    tag.upvote_count += 1;
                }
                tag.is_upvoted_by_me = ! tag.is_upvoted_by_me;
                let username = this.user.username;

                this.$axios.get(this.$api('users/' + username + '/upvote-tag/' + tag.id)).then((response) => {
                    let upvote = response.data.upvote;
                    let allUpvotes = response.data.all_upvotes;

                    if (upvote.is_deleted) {
                        this.$root.$emit('upvote-removed', upvote, allUpvotes);
                    } else {
                        console.log('emit added');
                        this.$root.$emit('upvote-added', upvote, allUpvotes);
                    }
                });
            }
        },
        computed: {
            loggedInUser() {
                return this.$store.state.user;
            }
        }
    }
</script>
