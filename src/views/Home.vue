<template>
  <div class="home">
    <img alt="SEF CMS logo" src="../assets/logo.png" class="sef-logo">
    <Preview :id="templateId"/>
  </div>
</template>

<script>
// @ is an alias to /src
import Preview from '@/components/Preview.vue'

export default {
  name: 'home',
  components: {
    Preview
  },
  data: function () {
        return {
            templateId: '2'
        }
    },
}
</script>

<style scoped lang="scss">
    .sef-logo {
        height: 250px;
    }
</style>