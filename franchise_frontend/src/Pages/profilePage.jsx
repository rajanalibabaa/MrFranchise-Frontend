
import React from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button } from "@mui/material";

const ProfilePage = () => {
  const navigate = useNavigate();

  const navItems = [
    { label: "Dashboard", onClick: () => navigate("/dashboard") },
    { label: "Post Requirement", onClick: () => navigate("/postrequirement") },
    { label: "Manage Profile", onClick: () => navigate("/manageprofie") },
    { label: "Response Manager", onClick: () => navigate("/responsemanager") },
  ];

  return (
    <Box
      sx={{
        width: 240,
        minHeight: "90vh",
        backgroundColor: "#f4f6f8",
        boxShadow: 3,
        p: 2,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <Box>
        <Button
          variant="contained"
          color="secondary"
          sx={{ width: "100%", mb: 2 }}
        >
          Upgrade Account
        </Button>

        {navItems.map((item, idx) => (
          <Button
            key={idx}
            onClick={item.onClick}
            fullWidth
            sx={{
              justifyContent: "flex-start",
              textTransform: "none",
              color: "#333",
              mb: 1,
              backgroundColor: "#fff",
              "&:hover": {
                backgroundColor: "#e0e0e0",
              },
            }}
          >
            {item.label}
          </Button>
        ))}
      </Box>

      <Box>
        <Button
          onClick={() => navigate("/feedback")}
          variant="outlined"
          color="primary"
          fullWidth
          sx={{ mb: 1 }}
        >
          Feedback
        </Button>
        <Button
          onClick={() => navigate("/compaint")}
          variant="outlined"
          color="error"
          fullWidth
        >
          Complaint
        </Button>
      </Box>
    </Box>
  )
}
export default ProfilePage;



