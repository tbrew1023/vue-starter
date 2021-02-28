<template>
    <div class="progress-bar-container">
        <div class="progress-bar-inner">
            <div :style="'width:'+value+'%' " class="progress-bar-juice"></div>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'ProgressBar',
        data() {
            return {

            }
        },
        props: {
            value: {
                type: Number,
                default: 0
            }
        }
    }
</script>

<style lang="scss" scoped>

.progress-bar-container {
    height: 100%;
    width: 160px;
    //background: purple;
    display: flex;
    align-items: center;
    margin-right: 50px;

    .progress-bar-inner {
        background: rgba(black, 0.1);
        width: 100%;
        height: 8px;
        border-radius: 12px;

        .progress-bar-juice {
            background: #4671B1;
            height: 100%;
            border-radius: 12px;
        }
    }
}
</style>