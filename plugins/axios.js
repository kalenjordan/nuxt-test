export default function ({ $axios }) {
  $axios.onRequest((config) => {
    // console.log(config.headers);
    config.headers.common.Accept = 'application/json'
  })
}
