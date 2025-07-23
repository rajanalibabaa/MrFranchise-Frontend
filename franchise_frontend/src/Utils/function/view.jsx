import axios from "axios";
import { api } from "../../Api/api.jsx";

const token = localStorage.getItem("accessToken");
const id = localStorage?.getItem("investorUUID") || localStorage?.getItem("brandUUID");

export const postView = async ( viewedID ) => {
    // console.log("id :",id)
    // console.log("viewedId :",viewedID)
    // console.log("token :",token)
    if (id && token && viewedID) {
        try {
        const response = await axios.post(`${api.viewApi.post}/${id}`, 
            { viewedID }, 
            {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}` // optional if token is needed
                }
            }
        );

        // console.log(response.data)


    } catch (error) {
        console.error("Error posting view:", error.response?.data || error.message);
        throw error;
    }
    }
};
