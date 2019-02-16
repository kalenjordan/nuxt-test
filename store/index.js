export const state = () => ({
    user: {
        name: "Loading..."
    },
    presentUsers: [],
    notifications: [],
    unreadNotificationCount: 0,
});

export const mutations = {
    updateUser(state, user) {
        state.user = user
    },
    updatePresentUsers(state, users) {
        state.presentUsers = users
    },
    updateNotifications(state, notifications) {
        state.notifications = notifications
    },
    updateUnreadNotificationCount(state, count) {
        state.unreadNotificationCount = count
    },
};
