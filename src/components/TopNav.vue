<template>
  <div id="nav" :class="( modalActive ? 'transparent' : '' )">
    <div class="logo"><h1>Title</h1></div>
    <div class="center">
        <router-link to="/">Home</router-link>
        <router-link to="/about">About</router-link>
        <router-link to="/original">Archive</router-link>
    </div>
    <div class="right">
        <div @click="openModal('Notifications')" class="notifications-container"><div v-if="notificationCount >= 1" class="badge">{{ notificationCount }}</div></div>
        <div @click="openModal('Exports')" class="exports-link">Exports</div>
    </div>
  </div>
</template>

<script>
import store from '../store';
import { dbUtils } from '../mixins/dbUtils';

export default {
    name: 'TopNav',
    mixins: [dbUtils],
    computed: {
        modalActive() {
            return store.state.modalActive;
        },
        modalContext() {
            return store.state.modalContext;
        },
        notificationCount() {
            return store.state.notifications.length;
        }
    }
}
</script>

<style lang="scss" scoped>
@import '../assets/styles/global';

.badge {
    background: red;
    color: white;
    height: 16px;
    width: 16px;
    border-radius: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    transform: translate(12px, -2px);
}

.exports-link {
    background: $colorMain;
    color: white;
    padding: $btnPad;
    border-radius: $rad;
    transition: 200ms;
    cursor: pointer;

    &:hover {
        transform: $shrink;
    }
}

.transparent {
    background: transparent !important;
}

.notifications-container {
    height: 24px;
    width: 24px;
    margin-right: 18px;
    background-image: url('https://raw.githubusercontent.com/tbrew1023/icommon/243c2c6c8080228d0b69ed7aa57f2bb0bdb4ded0/notify.svg');
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
    transition: $quick;
    cursor: pointer;

    &:hover {
        transform: $shrink;
    }
}

.profile-container {
    display: flex;
    justify-content: flex-end;
    align-items: center;

    .profile-img {
        height: 32px;
        width: 32px;
        background: black;
        margin-right: 12px;
        background-size: 130%;
        border-radius: 100%;
        background-position: center;
        background-repeat: no-repeat;
        background-image: url('https://github.com/tbrew1023/icommon/blob/master/images/skaterboi.png?raw=true');
    }
}

.logo, .center, .right {
    width: 500px;
}

.right {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    margin-right: 24px;
    font-weight: bold;
    font-size: 14px;
}

.logo {
    //height: 30px;
    //background-image: url('https://raw.githubusercontent.com/tbrew1023/icommon/2757752f4ef3bd544d10818dc5acaf2fc6410732/images/student-manager.svg');
    background-position: left;
    background-size: contain;
    background-repeat: no-repeat;
    margin-left: 24px;
}

.center {
    display: flex;
    justify-content: center;
    align-items: center;
}

#nav {
  padding: 0px;
  margin-top: 24px;
  position: absolute;
  top: 0px;
  display: flex;
  justify-content: space-between;
  width: 100%;
  background: white;
  height: 80px;
  align-items: center;
  margin: 0px;
  z-index: 99999;
  transition: 300ms;

  a {
    font-size: 14px;
    text-decoration: none;
    padding: $btnPad;
    border-radius: 36px;
    margin-left: 12px;
    margin-right: 12px;
    color: rgba(black, 0.3);
    font-weight: bold;
    transition: 200ms;

    &:hover {
        background: #eee;
    }

    &.router-link-exact-active {
      color: $colorMain;
      opacity: 1;
    }
  }
}

.ghost-inactive {
    background: transparent !important;
    color: black !important;
}
</style>