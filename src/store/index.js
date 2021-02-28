import { createStore } from 'vuex'

export default createStore({
  state: {
    modalContext: 'Notifications',
    timezone: 'UTC',
    exporting: false,
    exportComplete: false,
    notifications: [],
    modalActive: false,
    studentCount: 0,
    dbOperations: 0,
    currentStudent: null,
    globalTrans: false,
  },
  mutations: {
    updateModal: (state, context) => { state.modalContext = context },
    updateTimezone: (state, timezone) => { state.timezone = timezone },
    exportURL: (state, downloadURL) => { state.downloadURL = downloadURL },
    exportComplete: (state) => { state.exportComplete = true },
    isExporting: state => { state.exporting = true },
    isNotExporting: state => { state.exporting = false },
    pushNotification: (state, notificationContext) => { state.notifications.push(notificationContext) },
    removeNotification: ( state, notificationIndex ) => { state.notifications.splice(notificationIndex, 1) },
    openModal: (state, context) => { state.modalActive = true; state.modalContext = context },
    closeModal: (state) => { state.modalActive = false; },
    studentCount: (state, total) => { state.studentCount = total },
    logOperation: (state, message) => { state.dbOperations++; console.log(state.dbOperations, message); },
    setCurrentStudent: (state, context) => { state.currentStudent = context },
    togglePane(state) {
      state.globalTrans = true;
      setTimeout(() => {
        state.globalTrans = false;
      }, 600);
    },
    cancelTransition(state) {
      setTimeout(() => {
        state.globalTrans = false;
      },5);
    },
  },
  actions: {
  },
  modules: {
  }
})
