<template>
  <div class="card saved-search-card hoverable">
    <div class="card--background bg-secondary">
      <h3 class="text-center">
        <nuxt-link v-if="savedSearch.slug" class="naked-link" :to="{ path: '/s/' + savedSearch.slug }">
          {{ savedSearch.name }}
        </nuxt-link>
        <nuxt-link v-else class="naked-link" :to="{ path: '/s/' + savedSearch.id }">
          {{ savedSearch.name }}
        </nuxt-link>
      </h3>
    </div>
    <div class="card--avatar">
      <div class="card--avatar--inner">
        <div class="icon-wrapper">
          <i v-if="savedSearch.icon" class="material-icons">{{ savedSearch.icon }}</i>
          <i v-else class="material-icons">search</i>
        </div>
      </div>
    </div>
    <div class="card--inner p-2">
      <div v-if="savedSearch.users && savedSearch.users.length" class="saved-search--users flex flex-wrap">
        <div v-for="user in savedSearch.users.slice(0, 6)" :key="user.id" class="saved-search--user flex-1" :user="user">
          <nuxt-link class="no-link" :to="{ path: '/' + user.username }">
            <div class="mini-card m-2 p-3 border border-gray-lighter hover:border-gray-light text-center">
              <div class="user-avatar inline-block relative">
                <img
                  class="w-12 h-12 rounded-full border-2 border-secondary-light"
                  :src="user.avatar_path"
                >
                <i v-if="isPresent(user)" class="absolute is-present fas fa-circle" />
              </div>
              <div>
                <div class="user-name text-sm mb-1" style="-webkit-box-orient: vertical">
                  {{ user.name }}
                </div>
                <div class="headline text-xs" style="-webkit-box-orient: vertical">
                  {{ user.headline }}
                  <br>
                  <span v-for="(tag, index) in user.tags" :key="index">
                    <span>{{ tag.name }}</span><span v-if="index+1 < user.tags.length">, </span>
                  </span>
                </div>
              </div>
            </div>
          </nuxt-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['savedSearch'],
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
