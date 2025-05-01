import React from "react";
import { Box, Typography, Button, Container } from "@mui/material";
import { useNavigate } from "react-router-dom";

function SuccessPage() {
  const navigate = useNavigate();

  return (
    <Container maxWidth="sm">
      <Box textAlign="center" sx={{ mt: 5 }}>
        <Typography variant="h4" gutterBottom>
          Submission Successful!
        </Typography>
        <Typography variant="body1" gutterBottom>
          Thank you for submitting the form. We will get back to you soon.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate("/")}
        >
          Go to Home
        </Button>
      </Box>
    </Container>
  );
}

export default SuccessPage;