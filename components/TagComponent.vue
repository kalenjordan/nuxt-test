<template>
  <div class="inline-block">
    <template v-if="editing">
      <div class="tag tag-editable">
        <span class="tag-name">{{ tag.name }}</span>
        <span v-if="tag.count" class="tag-count">{{ tag.count }}</span>
        <i class="material-icons close" @click="deleteTag(tag)">close</i>
      </div>
    </template>
    <template v-else>
      <div class="tag tag-with-upvote border-1 fast text-sm sm:text-base">
        <nuxt-link :to="{ path: '/tag/' + tag.slug }" class="tag-name animated">
          <template v-if="tag.icon">
            <i class="tag-icon material-icons">{{ tag.icon }}</i>
          </template>
          {{ tag.name }}
        </nuxt-link>
        <span class="separator">&nbsp;</span>
        <span class="count-and-upvote animated" @click="upvoteTag(tag)">
          <span v-if="tag.upvote_count" class="tag-count">{{ tag.upvote_count }}</span>
          <i :class="{upvoted : tag.is_upvoted_by_me}" class="material-icons upvote-icon">thumb_up</i>
        </span>
      </div>
    </template>
  </div>
</template>

<script>
export default {
  props: ['user', 'tag', 'editing'],
  computed: {
    loggedInUser() {
      return this.$store.state.user
    }
  },
  methods: {
    upvoteTag(tag) {
      if (!this.loggedInUser.id) {
        return alert('Please login before you can upvote someone')
      }

      tag.upvote_count = (tag.is_upvoted_by_me) ? (tag.upvote_count - 1) : (tag.upvote_count + 1)
      tag.is_upvoted_by_me = !tag.is_upvoted_by_me
      const username = this.user.username

      this.$axios.get(this.$api('users/' + username + '/upvote-tag/' + tag.id)).then((response) => {
        const upvote = response.data.upvote
        const allUpvotes = response.data.all_upvotes

        if (upvote.is_deleted) {
          this.$root.$emit('upvote-removed', upvote, allUpvotes)
        } else {
          // eslint-disable-next-line no-console
          console.log('emit added')
          this.$root.$emit('upvote-added', upvote, allUpvotes)
        }
      })
    },
    async deleteTag(tag) {
      const index = this.user.tags.indexOf(tag)
      this.$delete(this.user.tags, index)

      const tags = await this.$axios.$get(this.$api('users/' + this.user.username + '/delete-tag/' + tag.id))
      this.user = Object.assign(...this.user, { tags })
    }
  }
}
</script>
