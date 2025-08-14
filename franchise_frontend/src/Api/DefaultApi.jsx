import axios from "axios";
import { token } from "../Utils/autherId";


export const postApi = async (url, bodydata) => {

    console.log("postApi :",url,bodydata)
  try {
    const res = await axios.post(url, bodydata, {
      headers:  {
      Authorization: `Bearer ${token}`
    }
    });
    // console.log("resres :",res.data)
    return res;
  } catch (error) {
    console.error("POST API Error:", error);
    throw error;
  }
};
export const getApi = async (url) => {

    // console.log("postApi :",url)
  try {
    const res = await axios.get(url, {
      headers:  {
      Authorization: `Bearer ${token}`
    }
    });
    // console.log("resres :",res.data)
    return res;
  } catch (error) {
    console.error("POST API Error:", error);
    throw error;
  }
};
