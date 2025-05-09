import React, { useState } from "react";
import Drawer from "@mui/material/Drawer";
import { Box, Typography, Avatar, Divider } from "@mui/material";
import { categories } from "../../Pages/BrandListingForm/BrandCategories";

const SideViewContent = ({ hoverCategory, onHoverLeave }) => {
  const [activeCategory, setActiveCategory] = useState(null);
  const [activeSubCategory, setActiveSubCategory] = useState(null);

  return (
    <Drawer
      anchor="top"
      open={hoverCategory !== null}
      onClose={onHoverLeave}
      PaperProps={{
        sx: {
          height: 500,
          boxShadow: "0px 10px 30px #f29724(232, 158, 158)",
          borderTop: "3px solid #f29724",
          borderRadius: "0 0 12px 12px",
          overflow: "hidden",
          borderRight: '1px solid #e2faa7',
          borderBottom: '5px solid #f29724',
          borderLeft: '1px solid #e2faa7'
        }
      }}
    >
      <Box
        onMouseLeave={onHoverLeave}
        sx={{
          display: "flex",
          height: "100%",
          overflow: "hidden",
          bgcolor: "#ffffff"
        }}
      >
        {/* Primary Categories - Dark Panel */}
        <Box sx={{
          width: 260,
          overflowY: "auto",
          py: 2,
          bgcolor: "#fafafa",
          color: "white"
        }}>
          <Typography
            variant="h6"
            fontWeight="bold"
            sx={{
              px: 3,
              py: 1.5,
              mb: 2,
              color: "#f29724",
              display: "flex",
              alignItems: "center",
              fontSize: "1.1rem"
            }}
          >
            <Box component="span" sx={{
              width: 4,
              height: 22,
              bgcolor: "#f29724",
              mr: 1.5,
              borderRadius: "2px"
            }} />
            Browse Categories
          </Typography>
          <Divider sx={{ borderColor: "rgba(255,255,255,0.15)", mb: 1 }} />
          {categories.map((category, index) => (
            <Box
              key={index}
              onMouseEnter={() => {
                setActiveCategory(index);
                setActiveSubCategory(null);
              }}
              sx={{
                cursor: "pointer",
                py: 1.5,
                px: 3,
                mb: 0.5,
                display: "flex",
                alignItems: "center",
                transition: "all 0.2s ease",
                position: "relative",
                bgcolor: activeCategory === index ? "rgba(242, 151, 36, 0.15)" : "transparent",
                "&:hover": {
                  // bgcolor: "rgb(15, 16, 14)"
                },
                "&:before": {
                  content: '""',
                  position: "absolute",
                  left: 0,
                  top: 0,
                  bottom: 0,
                  width: activeCategory === index ? "4px" : 0,
                  bgcolor: "#f29724",
                  transition: "width 0.2s ease"
                }
              }}
            >
              <Typography sx={{
                fontWeight: activeCategory === index ? "600" : "400",
                color: activeCategory === index ? "#f29724" : "rgba(0, 0, 0, 0.9)",
                ml: activeCategory === index ? "-4px" : 0,
                fontSize: "0.95rem"
              }}>
                {category.name}
              </Typography>
              <Box sx={{
                ml: "auto",
                color: "rgba(255,255,255,0.5)",
                fontSize: "0.875rem"
              }}>
                →
              </Box>
            </Box>
          ))}
        </Box>

        {/* Subcategories - Middle Panel */}
        {activeCategory !== null && (
          <Box sx={{
            width: 300,
            overflowY: "auto",
            py: 3,
            px: 2,
            bgcolor: "#f9f9f9",
            borderRight: "1px solid #eee"
          }}>
            <Typography
              variant="subtitle1"
              fontWeight="600"
              sx={{
                px: 2,
                py: 1,
                mb: 2,
                color: "#2a2a2a",
                display: "flex",
                alignItems: "center",
                fontSize: "1.05rem",
                borderBottom: "2px solid #f29724"
              }}
            >
              {categories[activeCategory].name}
            </Typography>
            {categories[activeCategory].children?.map((subCategory, idx) => (
              <Box
                key={idx}
                onMouseEnter={() => setActiveSubCategory(subCategory)}
                sx={{
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  py: 1.5,
                  px: 2,
                  mb: 1,
                  borderRadius: "6px",
                  transition: "all 0.2s ease",
                  bgcolor: activeSubCategory?.name === subCategory.name ? "rgba(242, 151, 36, 0.1)" : "transparent",
                  "&:hover": {
                    bgcolor: "rgba(253, 253, 253, 0.08)",
                    transform: "translateX(4px)"
                  }
                }}
              >
                {subCategory.icon && (
                  <Box
                    component={subCategory.icon}
                    sx={{
                      fontSize: 22,
                      mr: 2,
                      color: activeSubCategory?.name === subCategory.name ? "#f29724" : "#666"
                    }}
                  />
                )}
                <Typography sx={{
                  fontWeight: activeSubCategory?.name === subCategory.name ? "600" : "500",
                  color: activeSubCategory?.name === subCategory.name ? "#2a2a2a" : "#555",
                  fontSize: "0.95rem"
                }}>
                  {subCategory.name}
                </Typography>
              </Box>
            ))}
          </Box>
        )}

        {/* Subcategory Items - Content Panel */}
        {activeSubCategory && (
          <Box sx={{
            flex: 1,
            overflowY: "auto",
            p: 4,
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
            gap: 4,
            alignContent: "flex-start"
          }}>
            <Box gridColumn="1/-1" sx={{ mb: 2 }}>
              <Typography
                variant="h6"
                fontWeight="600"
                sx={{ color: "#2a2a2a", fontSize: "1.2rem" }}
              >
                {activeSubCategory.name}
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: "#f29724", mt: 0.5, fontSize: "0.9rem" }}
              >
                Browse our collection
              </Typography>
              <Divider sx={{ mt: 2, mb: 3, borderColor: "#eee" }} />
            </Box>

            {activeSubCategory.children?.map((subChild, idx) => {
              const name = typeof subChild === "string" ? subChild : subChild.name;
              const image = typeof subChild === "object" ? subChild.image : null;

              return (
                <Box
                  key={idx}
                  sx={{
                    textAlign: "center",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-5px)",
                      "& .MuiAvatar-root": {
                        boxShadow: "0 8px 20px rgba(242, 151, 36, 0.2)",
                        borderColor: "#f29724"
                      }
                    }
                  }}
                >
                  <Avatar
                    src={image}
                    alt={name}
                    sx={{
                      width: 90,
                      height: 90,
                      margin: "0 auto",
                      border: "2px solid #f0f0f0",
                      transition: "all 0.3s ease",
                      bgcolor: "white",
                      p: image ? 0 : 2
                    }}
                  />
                  <Typography
                    variant="subtitle2"
                    sx={{
                      mt: 2,
                      fontWeight: "600",
                      color: "#333",
                      fontSize: "0.95rem"
                    }}
                  >
                    {name}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      display: "block",
                      color: "#f29724",
                      fontWeight: "500",
                      mt: 0.5,
                      fontSize: "0.8rem"
                    }}
                  >
                    Shop now →
                  </Typography>
                </Box>
              );
            })}
          </Box>
        )}
      </Box>
    </Drawer>
  );
};

export default SideViewContent;