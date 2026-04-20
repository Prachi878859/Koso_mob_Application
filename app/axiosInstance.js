import axios from "axios";

const api = axios.create({
  // baseURL: "http://10.108.59.183:5000/api",  
baseURL: 'https://koso.sparklerstech.com/api',
 
headers: {
    "Content-Type": "application/json",
  },
});


export default api;