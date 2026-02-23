import axios from "axios";

const api = axios.create({
  baseURL: "http://192.168.1.13:5000/api",  
// baseURL: 'https://vlc.setlen.co.in/api',
 
headers: {
    "Content-Type": "application/json",
  },
});

export default api;