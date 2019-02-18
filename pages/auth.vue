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
        async mounted() {
            let url = process.env.API_URL + 'me?api_token=' + this.$route.query.api_token;
            this.$axios.get(url).then((response) => {
                this.user = response.data;
                this.$cookies.set('user', JSON.stringify(response.data));
                window.opener.location.reload();
                window.close();
            });
        },
        methods: {
            // none
        },
        computed: {
            loggedInUser() {
                return this.$store.state.user;
            },
        },
    }
</script>