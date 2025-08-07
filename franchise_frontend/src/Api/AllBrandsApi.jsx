// import React, { useEffect } from 'react';
// import axios from 'axios';
// import { useDispatch } from 'react-redux';
// import { fetchAllBrands } from '../Redux/Slices/AllBrandSlice/AllBrandSlice';

// const AllBrandsApi = () => {
    
//     const dispatch = useDispatch()

//     useEffect(() => {
//         const fetchBrands = async () => {
//             try {
//                 const token = localStorage.getItem("accessToken");
//                 const id = localStorage?.getItem("investorUUID") || localStorage?.getItem("brandUUID");
//                 let response;

//                 if (!token) {
//                     response = await axios.get(
//                         "http://localhost:5000/api/v1brandlisting/getAllBrandListing",
//                         {
//                             headers: {
//                                 "Content-Type": "application/json",
//                             },
//                         }
//                     );
//                 } else {
//                     response = await axios.get(
//                         `http://localhost:5000/api/v1like/favbrands/getAllLikedAndUnlikedBrand/${id}`,
//                         {
//                             headers: {
//                                 "Content-Type": "application/json",
//                                 Authorization: `Bearer ${token}`,
//                             },
//                         }
//                     );
//                 }

//                 console.log("All brand new data :",response.data.data)
                
//                 // setBrands(response.data.data);

//                 if (response.data) {
//                     dispatch(fetchAllBrands(response.data.data))
//                 }
//             } catch (err) {
//                 // setError(err.message || "Failed to fetch brands");
//                 console.error("Error fetching brands:", err);
//             }
//         };

//         fetchBrands();
//     }, [dispatch]);

//     return (
//         <div>
           
//         </div>
//     );
// };

// export default AllBrandsApi;