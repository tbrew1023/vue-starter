<template>
<div class="banner-container" :style="'background-image: url(' + backgroundImage + ')'">
    <div class="banner-content">
        <h1 :style="'color:' + primaryColor">{{ title }}</h1>
        <p>{{ subtitle }}</p>
        <router-link to="/about"><div :style="'background:' + primaryColor" class="primary-action"><div class="btn-icon"></div>About this Project</div></router-link>
    </div>
</div>
</template>

<script>
export default {
    name: 'Banner',
    props: {
        title: {
            type: String,
            default: 'Banner Title'
        },
        subtitle: {
            type: String,
            default: 'Banner subtitle'
        },
        backgroundImage: String,
        actionLink: {
            type: String,
            default: '/'
        },
        primaryColor: {
            type: String,
            default: 'black'
        }
    }
}
</script>

<style lang="scss" scoped>
@import '../assets/styles/global';

.btn-icon {
    background-size: contain;
    background-position: center;
    background-repeat: no-repeat;
    background-image: url('https://raw.githubusercontent.com/tbrew1023/icommon/abc3e39e0f3939885dad29448b2ac8dfc43aa656/bulb.svg');
    height: 16px;
    width: 16px;
    margin-right: 12px;
}

a {
    text-decoration: none;
}

.primary-action {
    width: max-content;
    padding: 12px 18px;
    color: white;
    border-radius: 8px;
    margin-top: 32px;
    cursor: pointer;
    transition: 200ms;
    display: flex;
    justify-content: center;
    align-items: center;

    &:hover {
        transform: scale(0.95) !important;
    }
}

.banner-content {
    text-align: left;
    margin-left: 80px;

    h1 {
        font-size: 36px;
        margin: 0px;
    }

    p {
        color: black;
        opacity: 0.4;
        font-size: 18px;
    }
}

.banner-container {
    height: 100%;
    width: 100%;
    border-radius: $rad;
    display: flex;
    justify-content: left;
    align-items: center;
    background-position: center;
    background-size: cover;
    background-repeat: no-repeat;
}

</style>