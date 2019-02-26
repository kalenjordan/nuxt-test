import Vue from 'vue'

Vue.prototype.$api = function (path) {
  if (this.loggedInUser) {
    path = path + (path.indexOf('?') !== -1 ? '&' : '?') + 'api_token=' + this.loggedInUser.api_token
  }

  return path
}

Vue.prototype.$metaTags = function (title, description, image) {
  return [
    { hid: 'title', name: 'title', property: 'og:title', content: title },
    { hid: 'description', name: 'description', property: 'og:description', content: description },
    { hid: 'image', name: 'image', property: 'og:image', content: image },

    { hid: 'twitter:card', name: 'twitter:card', content: 'summary_large_image' },
    { hid: 'twitter:site', name: 'twitter:site', content: '@kalenjordan' },
    { hid: 'twitter:creator', name: 'twitter:creator', content: '@kalenjordan' },
    { hid: 'twitter:title', name: 'twitter:title', content: title },
    { hid: 'twitter:image', name: 'twitter:image', content: image },
    { hid: 'twitter:description', name: 'twitter:description', content: description },

    { hid: 'og:title', name: 'og:title', content: title },
    { hid: 'og:description', name: 'og:description', content: description },
    { hid: 'og:image', name: 'og:image', content: image },

    { hid: 'apple-mobile-web-app-title', name: 'apple-mobile-web-app-title', content: title }
  ]
}
