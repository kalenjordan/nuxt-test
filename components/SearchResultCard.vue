<template>
  <div class="card user-card">
    <div class="card--inner flex items-center p-4 flex-wrap">
      <div class="card--avatar flex-2 text-center -ml-1">
        <nuxt-link class="relative" :to="{ path: '/' + user.username }">
          <img :src="user.avatar_path">
          <i v-if="isPresent(user)" class="absolute is-present fas fa-circle" />
        </nuxt-link>
      </div>
      <div class="flex-3 card--about text-sm sm:ml-2 leading-tight" style="-webkit-box-orient: vertical;">
        <div class="card--identity--name bold">
          <nuxt-link :to="{ path: '/' + user.username }" class="naked-link">
            {{ user.name }}
          </nuxt-link>
        </div>
        <div>
          {{ user.headline }}
        </div>
      </div>
      <div v-if="user.tags.length" class="flex-4  card--tags text-xs" style="-webkit-box-orient: vertical">
        <nuxt-link v-for="tag in user.tags" :key="tag.id" :to="{ path: '/tag/' + tag.slug }">
          <div class="tag animated fast">
            <span class="tag-name">
              <template v-if="tag.icon"><i class="tag-icon" :class="tag.icon" /></template>
              {{ tag.name }}
            </span>
            <span v-if="tag.upvote_count" class="separator">&nbsp;</span>
            <span class="count-and-upvote">
              <span v-if="tag.upvote_count" class="tag-count">{{ tag.upvote_count }}</span>
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
