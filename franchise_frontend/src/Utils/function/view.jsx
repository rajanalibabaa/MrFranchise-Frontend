import axios from "axios";
import { api } from "../../api/api";

export const postView = async () => {
    try {
        const response = await axios.post(api.viewApi.post, {}, {
            headers: {
                "Content-Type": "application/json"
            }
        });

        return response.data;

    } catch (error) {
        console.error("Error posting view:", error);
        throw error;
    }
};
