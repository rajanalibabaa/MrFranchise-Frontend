import { api } from "./api"
import { getApi, postApi } from "./DefaultApi"
import { userId } from "../Utils/autherId"

export const handleShortList = async(brandId) => {
  // console.log("handleShortList :",brandId)
   
      const url = `${api.shortListApi.post}/${userId}`
    const data = {
            shortListedId: brandId 
        }
    await postApi(url,data)

    return

    

}

