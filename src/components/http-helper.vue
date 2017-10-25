<script>
    import axios from 'axios';

    export const HTTP = axios.create({
        baseURL: 'http://eterra.brainzined.com/api/'
    })
</script>
