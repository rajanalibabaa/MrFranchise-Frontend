// utils/pincodeLookup.js
import axios from 'axios';

export const fetchPincodeDetails = async (pincode) => {
  try {
    const response = await axios.get(`https://api.postalpincode.in/pincode/${pincode}`);
    // const response = await axios.get(`https://api.postalpincode.in/pincode/${pincode}`);
    if (response.data && response.data[0].Status === 'Success') {
      const postOffice = response.data[0].PostOffice[0];
      return {
        state: postOffice.State,
        district: postOffice.District,
        city: postOffice.Name || postOffice.District
      };
    }
    throw new Error('Invalid pincode or no data found');
  } catch (error) {
    console.error('Pincode lookup error:', error);
    throw error;
  }
};