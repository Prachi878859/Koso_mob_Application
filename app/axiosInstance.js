import axios from "axios";

const api = axios.create({
  baseURL: "http://192.168.1.5:5000/api",  
// baseURL: 'https://koso.sparklerstech.com/api',
 
headers: {
    "Content-Type": "application/json",
  },
});


export default api;