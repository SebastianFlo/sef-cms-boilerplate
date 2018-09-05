<template>
    <div id="app">
        <router-view/>
    </div>
</template>

<style lang="scss">
    @import '../node_modules/grapesjs/dist/css/grapes.min.css';
    /* @import '../node_modules/grapesjs-preset-webpage/dist/grapesjs-preset-webpage.min.css'; */

    html, body {
        margin: 0;
        height: 100%;
    }

    #app {
        font-family: 'Avenir', Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-align: center;
        color: #2c3e50;
        height: 100%;
    }

</style>