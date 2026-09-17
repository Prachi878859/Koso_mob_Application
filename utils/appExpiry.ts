// import api from '../app/axiosInstance';

// export const checkServerExpiry = async (): Promise<boolean> => {
//   try {
//     const response = await api.get('/app/status');

//     console.log('App Status:', response.data);

//     return response.data.expired === true;
//   } catch (error) {
//     console.error('Server expiry check failed:', error);

//     // Server unavailable = app locked
//     return true;
//   }
// };


const APP_EXPIRY_DATE = new Date('2026-09-30T18:30:00Z');
 export const checkAppExpiry = (): boolean => { const currentDate = new Date();
     return currentDate >= APP_EXPIRY_DATE; };