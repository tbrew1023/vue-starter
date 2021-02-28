<template>
  <div id="app">
    <div class="transition-pane-container">
      <div :class="( globalTrans ? 'pane-active' : 'pane-inactive' )" class="pane"></div>
    </div>
    <div class="modal-backdrop" :class="( modalActive ? 'blur' : 'backdrop-inactive' )"></div>
    <div class="modal-layer" :class="( modalActive ? 'modal-active' : 'modal-inactive' )">
      <div :class="( modalActive ? 'modal-enter' : 'modal-gone' )" class="modal">
        <Modal />
      </div>
    </div>
    <TopNav />
    <router-view/>
  </div>
</template>

<script>
import TopNav from '@/components/TopNav.vue';
import Modal from '@/components/Modal.vue';
import store from './store';

export default {
  name: 'App',
  components: {
    TopNav,
    Modal
  },
  computed: {
    modalActive() {
      return store.state.modalActive;
    },
    globalTrans() {
      return store.state.globalTrans;
    },

  }
}
</script>

<style lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Work+Sans&display=swap');

.foreupdate-test {
  position: absolute;
  z-index: 9999;
  width: 100px;
  height: 100px;
  background: green;
  cursor: pointer;
}

.modal-inactive {
  pointer-events: none;
}

.backdrop-inactive {
  pointer-events: none;
}

#app {
  font-family: 'Work Sans', sans-serif;
  font-size: 14px;
}

body {
  margin: 0px;
  padding: 0px;
}

.modal-enter {
  opacity: 1;
  transform: scale(1);
  pointer-events: all;
}

.modal-gone {
  opacity: 0;
  transform: scale(0.8);
  pointer-events: none;
}

.modal-layer {
  height: calc(100vh - 80px);
  width: 100%;
  background: transparent;
  position: absolute;
  top: 80px;
  z-index: 9999;
  transition: 300ms;
  display: flex;
  justify-content: center;
  align-items: center;

  .modal {
    background: white;
    width: 800px;
    height: 500px;
    border-radius: 8px;
    margin-top: -80px;
    transition: 300ms;
  }
}

.modal-backdrop {
  height: 100vh;
  width: 100%;
  position: absolute;
  top: 0px;
  z-index: 9999;
  pointer-events: none;
  transition: 300ms;
}

.blur {
  backdrop-filter: blur(36px) brightness(0.9);
}

.transition-pane-container {
  position: fixed;
  height: 100vh;
  width: 100vw;
  padding: 0px;
  margin: 0px;
  z-index: 999999;
  pointer-events: none;
  top: 0px;

  .pane-active {
    height: 100vh;
    bottom: 0px;
    transform: rotate(0deg) scale(1);
  }

  .pane-inactive {
    height: 0vh;
    top: 0px;
    transform: scale(1);
  }

  .pane {
    background: #2e5083;
    width: 100%;
    position: absolute;
    bottom: 0px;
    //transition: 1.5s cubic-bezier(0.65, 0, 0.35, 1);
    transition: 600ms cubic-bezier(0.87, 0, 0.13, 1);
  }
}
</style>
