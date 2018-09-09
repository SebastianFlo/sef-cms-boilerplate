<template>
    <div class="preview">
        <div v-html="rawHtml"></div>
    </div>
</template>

<script>
    import axios from 'axios';
    import { generateStyleEl }  from '@/utils/style-generator';

    export default {
        name: 'Preview',
        data: function () {
            return {
                rawHtml: '',
                css: '',
            }
        },
        props: {
            id: String,
        },
        mounted: function () {
            this.checkTemplates();
        },
        methods: {
            checkTemplates() {
                axios
                    .get(`api/templates/${this.id}`)
                    .then(response => {
                        let { html, css } = response.data;
                        this.rawHtml = html;
                        this.generateStyleEl(css);
                    })
                    .catch(error => {
                        console.error('Loading templates', error);
                    });
            }
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
    /* See how not to have to copy block styles */
    .sef-component-drawing {
        width: '350px';
    }
</style>