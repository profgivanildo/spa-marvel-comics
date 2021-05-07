import axios from 'axios'

const APIMarvel = axios.create({
    baseURL: 'https://gateway.marvel.com/'
});

export default APIMarvel;