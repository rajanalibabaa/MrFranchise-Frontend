import axios from 'axios';

/**
 * Fetch city, district, and state by global postal code using OpenStreetMap Nominatim API.
 * @param {string} postalCode - The postal code to look up
 * @param {string} country - Country name (optional but recommended for better accuracy)
 * @returns {Promise<{ state: string, district: string, city: string }>}
 */
export const fetchPincodeDetails = async (postalCode, country = '') => {
  try {
<<<<<<< HEAD
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
=======
    const query = country
      ? `postalcode=${postalCode}&country=${country}`
      : `q=${postalCode}`;

    const url = `https://nominatim.openstreetmap.org/search?${query}&format=json&addressdetails=1`;

    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'YourAppName/1.0 (your@email.com)' // required by OSM
      }
    });

    const result = response.data?.[0];
    const address = result?.address;

    if (!address) throw new Error('No location found for this postal code.');

    return {
      state: address.state || '',
      district: address.county || address.state_district || '',
      city:
        address.city ||
        address.town ||
        address.village ||
        address.hamlet ||
        address.suburb ||
        address.county ||
        ''
    };
>>>>>>> ba5cada403e269f35d9991602f8ff1b64a93d542
  } catch (error) {
    console.error('Global postal code lookup failed:', error.message || error);
    throw new Error('Unable to fetch location details.');
  }
};
