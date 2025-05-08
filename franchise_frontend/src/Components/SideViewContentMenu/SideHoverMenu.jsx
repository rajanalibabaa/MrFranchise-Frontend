import React, { useState } from "react";
import Drawer from "@mui/material/Drawer";
import { Box } from "@mui/material";

import { categories } from "../../Pages/BrandListingForm/BrandCategories";

// categories definition omitted here for breim

const SideViewContent = ({ hoverCategory, onHoverLeave }) => {
  const [activeCategory, setActiveCategory] = useState(null);
  const [activeSubCategory, setActiveSubCategory] = useState(null);

  return (
    <Drawer
      anchor="top"
      open={hoverCategory !== null}
      onClose={onHoverLeave}
      PaperProps={{ sx: { height: 400 } }}
    >
      
      <Box
        className="category-container"
        onMouseLeave={onHoverLeave}
        sx={{ padding: 2, display: "flex", flexDirection: "row", gap: 2 }}
      >
        {/* Main Categories */}
        <div className="main-categories">
          {categories.map((category, index) => (
            <div
              key={index}
              className={`menu-item ${activeCategory === index ? "active" : ""}`}
              onMouseEnter={() => {
                setActiveCategory(index);
                setActiveSubCategory(null);
              }}
            >
              {category.name}
            </div>
          ))}
        </div>

        {/* Subcategories */}
        <div className="subcategories">
          {activeCategory !== null &&
            categories[activeCategory].children.map((subCategory, subIndex) => (
              <div
                key={subIndex}
                className={`subcategory-item`}
                onMouseEnter={() => setActiveSubCategory(subCategory)}
              >
                {subCategory.name}
              </div>
            ))}
        </div>

        {/* Sub-Child Categories */}
        {activeSubCategory && (
          <div className="subchild-categories">
            {activeSubCategory.children && (
              <div className="sub-subcategories-list">
                {activeSubCategory.children.map((subChild, idx) => (
                  <div key={idx} className="subchild-item">
                    {typeof subChild === "string" ? subChild : subChild.name}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </Box>
    </Drawer>
  );
};

export default SideViewContent;
