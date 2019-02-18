import Vue from 'vue'
Vue.prototype.$api = function(path) {
    let url = process.env.API_URL + path;
    url = url + (url.indexOf('?') !== -1 ? '&' : '?') + 'api_token=' + this.loggedInUser.api_token;

    return url;
};