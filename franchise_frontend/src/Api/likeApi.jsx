import { api } from "./api"
import { postApi } from "./DefaultApi"

export const likeApiFunction = async(id) => {

    // console.log("likeApiFunction :",id)
    const data = {
        branduuid : id
    }
    try {
        await postApi(api.likeApi.post,data)
    } catch (error) {
        console.error(error)
    }
}