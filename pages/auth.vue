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
            let auth = 'api_token=' + this.$route.query.api_token;
            this.$axios.get('https://local.pros.global.test/api/v1/me?' + auth).then((response) => {
                this.user = response.data;
                this.$cookies.set('user', JSON.stringify(response.data));
                window.opener.location.reload();
                window.close();
            });
        },
    }
</script>