import axios from "axios"
import { api } from "./api"

export const handleShortList = async(brandId) => {
    const id = localStorage.getItem("investorUUID") || localStorage.getItem("brandUUID")

    const token = localStorage.getItem("accessToken");

    // if (!brand.isShortListed) {
        const res = await axios.post(`${api.shortListApi.post}/${id}`,
        {
            shortListedId: brandId
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          
        }
    )

    console.log("res shortlist :",res.data)
    return res.data

    

}