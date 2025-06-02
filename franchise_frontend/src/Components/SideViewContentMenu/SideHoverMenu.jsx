import React, { useState } from "react";
import Drawer from "@mui/material/Drawer";
import { Box, Typography, Avatar, Dialog, DialogTitle, DialogContent, IconButton   } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { categories } from "../../Pages/Registration/BrandLIstingRegister/BrandCategories";
import { useDispatch, useSelector } from "react-redux";
import { openBrandDialog, closeBrandDialog } from "../../Redux/Slices/brandSlice";

import axios from "axios";

const SideViewContent = ({ hoverCategory, onHoverLeave }) => {
  const [activeCategory, setActiveCategory] = useState(null);
  const [activeSubCategory, setActiveSubCategory] = useState(null);
  const [filteredBrands, setFilteredBrands] = useState([]);
  const [brandsData, setBrandsData] = useState([]);
  // const [selectedBrand, setSelectedBrand] = useState(null); 
 
  const fetchBrandDetails = async (hover) => {
  try {
    const response = await axios.get(
      "https://franchise-backend-wgp6.onrender.com/api/v1/brandlisting/getAllBrandListing",
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
       setBrandsData(response.data.data);
  } catch (error) {
     setBrandsData([]);
  }
};

const dispatch = useDispatch();
const { openDialog, selectedBrand } = useSelector((state) => state.brands);

  // Fetch brands on mount (or when Drawer opens)
  React.useEffect(() => {
    if (hoverCategory !== null && brandsData.length === 0) {
      fetchBrandDetails();
    }
  }, [hoverCategory]);

  // Filter brands when hovering subChild
const handleSubChildHover = async (children) => {
  const childName = typeof children === "string" ? children : children.name;
  console.log("Hovering subChild:", childName);
  const filtered = brandsData.filter((brand) => {
    const categories = brand.personalDetails?.brandCategories || [];
    console.log("Brand categories:", categories);
    return categories.some((cat) => cat.child === childName);
  });
  setFilteredBrands(filtered);
};

  return (
    <Drawer anchor="top" open={hoverCategory !== null} onClose={onHoverLeave} PaperProps={{ sx: { height: 450 } }}>
      <Box onMouseLeave={onHoverLeave} sx={{ display: "flex", flexDirection: "row", height: "100%",  overflow: "hidden"}} >
        <Box sx={{ width: 220, borderRight: "1px solid #eee", overflowY: "auto", px: 2, py: 1, }} >
          <Typography variant="subtitle1" fontWeight="bold" mb={1}>
            Top categories
          </Typography>
          {categories.map((category, index) => (
            <Box key={index} onMouseEnter={() => {
                setActiveCategory(index);
                setActiveSubCategory(null);
              }}
              sx={{ cursor: "pointer", py: 1, color: activeCategory === index ? "#1976d2" : "inherit", fontWeight: activeCategory === index ? "bold" : "normal", }} >
              {category.name}
            </Box>
          ))}
        </Box>

        {activeCategory !== null && (
          <Box sx={{ width: 300, borderRight: "1px solid #eee", overflowY: "auto", px: 2, py: 1, }} >
            <Typography variant="subtitle1" fontWeight="bold" mb={1} display="flex" alignItems="center" >
              {categories[activeCategory].name}
            </Typography>
            {categories[activeCategory].children?.map((subCategory, idx) => (
              <Box key={idx} onMouseEnter={() => setActiveSubCategory(subCategory)}
                sx={{ cursor: "pointer", display: "flex", alignItems: "center", py: 1, gap: 1, }} >
                {subCategory.icon && (
                  <Box component={subCategory.icon} sx={{ fontSize: 20 }} />
                )}
                <Typography>{subCategory.name}</Typography>
              </Box>
            ))}
          </Box>
        )}
         {activeSubCategory && (
         <Box  sx={{    width: 350,    borderRight: "1px solid #eee",    overflowY: "auto",    px: 2,    py: 1,  }}>
           <Typography  variant="subtitle1"  fontWeight="bold"  mb={1}  display="flex"  alignItems="center">
             {activeSubCategory.name}
           </Typography>
           {activeSubCategory.children?.map((children, idx) => {
             const name = typeof children === "string" ? children : children.name;
             const Icon = typeof children === "object" ? children.icon : null;
       
             return (
               <Box
                 key={idx}
                 onMouseEnter={() => handleSubChildHover(children)}
                 sx={{ cursor: "pointer", display: "flex", alignItems: "center", py: 1, gap: 1,   }} >
                 {Icon && (
                   <Box component={Icon} sx={{ fontSize: 20 }} />
                 )}
                 <Typography>{name}</Typography>
               </Box>
             );
           })}


         </Box>
       )}

           {/* Render filtered brands */}
       {filteredBrands.length > 0 && (
              <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle1" fontWeight="bold" mb={2}>
                Brands :
              </Typography>
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "repeat(4, 1fr)",
                  gap: 2,
                  px: 1, // slight horizontal padding inside grid
        }} > 

      {filteredBrands.slice(0, 16).map((brand, idx) => (
        <Box
          key={brand._id || idx}
          onClick={() => dispatch(openBrandDialog(brand))}
          sx={{ display: "flex", flexDirection: "column", alignItems: "center", p: 2, border: "1px solid #e0e0e0", borderRadius: 3, background: "#fff", minHeight: 160, boxShadow: "0 2px 8px 0 rgba(60,72,88,0.06)", transition: "box-shadow 0.2s , transform 0.2s",cursor: "pointer",
            "&:hover": {
              boxShadow: "0 4px 16px 0 rgba(60,72,88,0.12)",
              borderColor: "0 2px 8px 0 rgba(60,72,88,0.06)",
              transform: "scale(1.10)",
              zIndex: 2,
            },
          }}
        >
          <Avatar
            src={brand.brandDetails?.brandLogo || ""}
            alt={brand.personalDetails?.brandName || "B"}
            sx={{ width: 100, height: 100, mb: 1, bgcolor: "#e0e0e0", fontSize: 30,
            }}
          >
            {brand.personalDetails?.brandName? brand.personalDetails.brandName[0]: "B"}
          </Avatar>
          <Typography fontWeight="bold" noWrap textAlign="center" sx={{ width: "100%" }}>
            {brand.personalDetails?.brandName}
          </Typography>
          <Typography variant="body2" color="text.secondary" noWrap textAlign="center"
            sx={{ width: "100%" }}
          >
            {brand.personalDetails?.companyName}
          </Typography>
        </Box>
      ))}
    </Box>
  </Box>
)}  

      {/* Brand Details Dialog */}
        <Dialog open={openDialog} onClose={() => dispatch(closeBrandDialog())} maxWidth="sm" fullWidth>
          <DialogTitle>
            {selectedBrand?.personalDetails?.brandName || "Brand Details"}
            <IconButton
              aria-label="close"
               onClick={() => dispatch(closeBrandDialog())}
              sx={{ position: "absolute", right: 8, top: 8 }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent dividers>
          
          </DialogContent>
        </Dialog>

      </Box>
    </Drawer>
  );
};

export default SideViewContent;