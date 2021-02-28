<template>
    <div>
        <h2>{{ name }}</h2>
        <button class="btn1" @click="goUp">Go up</button>
        <button class="btn2" @click="goDown">Go down</button>
        <h1>{{ getInvert(numClicks) }}</h1>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                numClicks: 0,
                altNumClicks: 0,
                name: 'Trent'
            }
        },
        mounted() {
            console.log('the page has rendered');
        },
        methods: {
            getInvert(num) {
                return num * -1;
            },
            goUp() {
                console.log(this.numClicks++);
            },
            goDown() {
                console.log(this.numClicks--);
            },
            fetchUsers() {

            }
        }
    }
</script>

<style lang="scss" scoped>
    button {
        color: white;
        border: none;
        border-radius: 24px;
        padding: 12px 24px;
        transition: 300ms;
        cursor: pointer;

        &:hover {
            background: green;
        }
    }

    .btn1 {
        background: blue;
    }

    .btn2 {
        background: orange;
    }
</style>