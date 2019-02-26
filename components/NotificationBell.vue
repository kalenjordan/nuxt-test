<template>
  <div class="notification-wrapper relative">
    <i class="material-icons font-120 cursor-pointer animated" @click="toggleNotifications()">
      notifications
    </i>
    <span
      v-if="unreadNotificationCount"
      class="alert-bubble absolute bg-highlight rounded-full cursor-pointer"
      @click="toggleNotifications()"
    >
      {{ unreadNotificationCount }}
    </span>
    <div v-if="showingNotifications" class="card notification-list absolute w-64">
      <div class="card-inner font-120">
        <ul v-if="notifications.length" class="list-reset">
          <li
            v-for="(notification,i) in notifications"
            :key="i"
            :class="{'bg-primary-lightest' : notification.read_at === null}"
            class="px-4 py-2"
          >
            {{ notification.data.text }}
            <nuxt-link
              v-if="notification.data.link"
              :to="{ name: notification.data.link.name, params: notification.data.link.params}"
              class="paragraph-link"
            >
              {{ notification.data.link.cta }}
            </nuxt-link>
            <span v-if="notification.created_at" class="text-gray">
              {{ notification.created_at | moment('subtract', '6 hours') | moment('from') }}
            </span>
            <span v-else class="text-gray">
              Just now
            </span>
          </li>
        </ul>
        <ul v-else class="list-reset">
          <li class="p-2">
            No notifications yet
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['hideSearch', 'user'],
  data() {
    return {
      showingNotifications: false
    }
  },
  computed: {
    loggedInUser() {
      return this.$store.state.user
    },
    unreadNotificationCount() {
      return this.$store.state.unreadNotificationCount
    },
    notifications() {
      return this.$store.state.notifications
    }
  },
  watch: {
    // Used to work from mounted() but then it stopped and now this works
    loggedInUser(newVal, oldVal) {
      if (newVal && oldVal && (!oldVal.id || newVal.id !== oldVal.id)) {
        this.initNotificatons()
      }
    }
  },
  mounted() {
    // this.listenForMessages();
  },
  methods: {
    initNotificatons() {
      if (this.loggedInUser.api_token) {
        this.$axios.get(this.$api('notifications')).then((response) => {
          this.$store.commit('updateUnreadNotificationCount', response.data.unread_count)
          this.$store.commit('updateNotifications', response.data.notifications)
        })
      }
    },
    async toggleNotifications() {
      this.showingNotifications = !this.showingNotifications
      await this.$axios.$get(this.$api('notifications/mark-read'))
      this.$store.commit('updateUnreadNotificationCount', 0)
    }
  }
}
</script>
