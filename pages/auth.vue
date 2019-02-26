<template>
  <section class="container">
    <div>
      <h1 class="title">
        auth, {{ user.name }}
      </h1>
    </div>
  </section>
</template>

<script>
export default {
  data() {
    return {
      user: { name: 'not logged in' }
    }
  },
  computed: {
    loggedInUser() {
      return this.$store.state.user
    }
  },
  mounted() {
    this.$axios.get('me?api_token=' + this.$route.query.api_token).then((response) => {
      this.user = response.data
      this.$cookies.set('user', JSON.stringify(response.data))
      window.opener.location.reload()
      window.close()
    })
  },
  methods: {
    // none
  }
}
</script>
