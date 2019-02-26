<template>
  <div class="card user-card">
    <div class="card--background bg-primary" />
    <div class="card--inner p-4">
      <div class="card--avatar">
        <nuxt-link class="relative" :to="{ path: '/' + user.username }">
          <img :src="user.avatar_path">
          <i v-if="isPresent(user)" class="absolute is-present fas fa-circle" />
        </nuxt-link>
      </div>
      <div class="card--cta">
        <nuxt-link class="btn px-5 py-2" :to="{ path: '/' + user.username }">
          View
        </nuxt-link>
      </div>
      <div class="card--identity mb-2">
        <div class="card--identity--name">
          <nuxt-link :to="{ path: '/' + user.username }" class="naked-link">
            {{ user.name }}
          </nuxt-link>
        </div>
        <div class="card--identity--handle font-small">
          <nuxt-link :to="{ path: '/' + user.username }" class="naked-link">
            @{{ user.username }}
          </nuxt-link>
        </div>
      </div>
      <div class="card--about text-xs mb-2 leading-tight" style="-webkit-box-orient: vertical">
        {{ user.headline }}
      </div>
      <div class="card--tags text-xs">
        <nuxt-link v-for="tag in user.tags" :key="tag.id" :to="{ path: '/tag/' + tag.slug }">
          <div class="tag mini-tag animated fast">
            <span class="tag-name">
              <template v-if="tag.icon"><i class="tag-icon material-icons">{{ tag.icon }}</i></template>
              {{ tag.name }}
            </span>
            <span v-if="tag.upvote_count" class="separator">&nbsp;</span>
            <span v-if="tag.upvote_count" class="count-and-upvote">
              <span class="tag-count">{{ tag.upvote_count }}</span>
            </span>
          </div>
        </nuxt-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['user'],
  computed: {
    loggedInUser() {
      return this.$store.state.user
    },
    presentUsers() {
      return this.$store.state.presentUsers
    }
  },
  methods: {
    isPresent(user) {
      const ids = []
      const presentUsers = this.presentUsers
      for (const i in presentUsers) {
        ids.push(presentUsers[i].id)
      }
      return ids.includes(user.id)
    }
  }
}
</script>
