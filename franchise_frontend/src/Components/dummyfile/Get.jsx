import { useEffect } from "react";
import axios from "axios";
const Get = () => {
    useEffect(() => {
        const topbrandData = async () => {
          try {
            const response = await axios.get("http://localhost:5000/api/v1/admin/videoAdvertise/getAdminVideoAdvertise");
            console.log(response.data);
      
            // setTopBrandData(response.data);
          } catch (error) {
            console.error("Error fetching top brand data:", error);
          }
        };
      
        topbrandData();
      }, []);
  return (
    <div>Get</div>
  )
}

export default Get