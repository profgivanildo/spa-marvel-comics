import axios from 'axios'

const APIMarvel = axios.create({
    baseURL: 'http://gateway.marvel.com/'
});

export default APIMarvel;