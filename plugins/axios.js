export default function ({ $axios, store }) {
    $axios.onRequest((config) => {
        // console.log(config.headers);
        config.headers.common['Accept'] = 'application/json';
    })
}