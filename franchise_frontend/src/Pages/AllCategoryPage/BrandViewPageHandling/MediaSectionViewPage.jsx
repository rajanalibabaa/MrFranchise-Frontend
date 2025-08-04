import React from "react";
import { Box, Typography } from "@mui/material";
import { motion } from "framer-motion";

const MediaSection = ({
  allVideos = [], // default empty array
  allImages = [], // default empty array
  isMobile,
  isTablet,
  getImageBoxSize,
  handleImageOpen,
}) => {
  console.log("allVideos", allVideos);

  const videoSrc = Array.isArray(allVideos) ? allVideos[0] : allVideos;
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2, duration: 0.5 }}
    >
      <Box display="flex" flexDirection={isMobile ? "column" : "row"} gap={4}>
        {/* Main video */}
        <Box flex={isMobile ? "none" : 2}>
          <Box
            sx={{
              width: "100%",
              height: isMobile ? 200 : isTablet ? 300 : 416,
              borderRadius: 2,
              overflow: "hidden",
              backgroundColor: "#f5f5f5",
            }}
            component={motion.div}
            whileHover={{ scale: 1.01 }}
          >
           {videoSrc ? (
  <video
    controls
    preload="auto"
    poster={allImages?.[0] || ""}
    style={{
      width: "100%",
      height: "100%",
      objectFit: "cover",
      cursor: "pointer",
    }}
    playsInline
  >
    <source src={videoSrc} type="video/mp4" />
    Your browser does not support the video tag.
  </video>
) : (
  <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}>
    <Typography>No promotional video available</Typography>
  </Box>
)}

          </Box>
        </Box>

        {/* Gallery images */}
        <Box flex={1}>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: 1,
            }}
          >
            {allImages.slice(0, 3).map((imageUrl, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
              >
                <Box
                  sx={{
                    width: "100%",
                    height: getImageBoxSize(),
                    overflow: "hidden",
                    borderRadius: 2,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    bgcolor: "#f5f5f5",
                    position: "relative",
                  }}
                  onClick={() => handleImageOpen(index)}
                >
                  <img
                    src={imageUrl}
                    loading="lazy"
                    alt={`Gallery ${index}`}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      position: "absolute",
                      top: 0,
                      left: 0,
                    }}
                  />
                </Box>
              </motion.div>
            ))}

            {/* View More */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              whileHover={{ scale: 1.02 }}
            >
              <Box
                sx={{
                  width: "100%",
                  height: getImageBoxSize(),
                  overflow: "hidden",
                  borderRadius: 2,
                  cursor: "pointer",
                  position: "relative",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  bgcolor: "rgba(0,0,0,0.05)",
                  "&:hover": { bgcolor: "rgba(0,0,0,0.1)" },
                }}
                onClick={() => handleImageOpen(3)}
              >
                <Typography
                  variant={isMobile ? "body2" : "h6"}
                  sx={{
                    fontWeight: 600,
                    textAlign: "center",
                    zIndex: 1,
                    fontSize: isMobile ? "0.875rem" : "1rem",
                    color: "text.primary",
                  }}
                >
                  View More ({Math.max(allImages.length - 3, 0)}+)
                </Typography>
                {allImages[3] && (
                  <>
                    <img
                      src={allImages[3]}
                      loading="lazy"
                      alt=""
                      style={{
                        position: "absolute",
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        filter: "blur(10px)",
                        opacity: 0.3,
                        zIndex: 0,
                      }}
                    />
                  </>
                )}
              </Box>
            </motion.div>
          </Box>
        </Box>
      </Box>
    </motion.div>
  );
};

export default MediaSection;
