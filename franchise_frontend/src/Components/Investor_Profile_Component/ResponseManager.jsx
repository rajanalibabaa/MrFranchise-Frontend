import React, { useState } from 'react';
import {
  Box, Typography, List, ListItemButton, ListItemText,
  Collapse, Paper, Button, FormControl, InputLabel,
  Select, MenuItem, TextField, Rating, Snackbar
} from "@mui/material";
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import StarIcon from '@mui/icons-material/Star';
import axios from 'axios';
import { useSelector } from 'react-redux';

// Rating labels
const labels = {
  0.5: 'Useless', 1: 'Useless+', 1.5: 'Poor', 2: 'Poor+',
  2.5: 'Ok', 3: 'Ok+', 3.5: 'Good', 4: 'Good+',
  4.5: 'Excellent', 5: 'Excellent+',
};
const getLabelText = (value) => `${value} Star${value !== 1 ? 's' : ''}, ${labels[value]}`;

// Feedback Component
const FeedBack = () => {
  const [value, setValue] = useState(2);
  const [hover, setHover] = useState(-1);
  const [selectedTopic, setSelectedTopic] = useState('');
  const [feedbackText, setFeedbackText] = useState('');
  const [msg, setmsg] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const { investorUUID, AccessToken } = useSelector((state) => state.auth || {});

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!investorUUID || !AccessToken) return;

    const data = { topic: selectedTopic, rating: value, feedback: feedbackText };

    try {
      const response = await axios.post(
        `http://localhost:5000/api/v1/feedback/createFeedback/${investorUUID}`,
        data,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${AccessToken}`,
          },
        }
      );
      setmsg(response.data.message || "Feedback submitted successfully!");
      setSnackbarOpen(true);
      setFeedbackText('');
      setSelectedTopic('');
      setValue(2);
    } catch (error) {
      setmsg("Failed to submit feedback.");
      setSnackbarOpen(true);
      console.error("Submission error:", error);
    }
  };

  return (
    <Box sx={{ p: 2 }}>
      <Paper elevation={4} sx={{ p: 4, maxWidth: 700, mx: "auto", borderRadius: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: "bold", mb: 3, textAlign: "center", color: "#ffa000" }}>
          Submit Your Feedback
        </Typography>

        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
          <Rating
            value={value}
            precision={0.5}
            getLabelText={getLabelText}
            onChange={(e, newValue) => setValue(newValue)}
            onChangeActive={(e, newHover) => setHover(newHover)}
            size="large"
            emptyIcon={<StarIcon style={{ opacity: 0.4 }} fontSize="inherit" />}
          />
          <Box sx={{ ml: 2 }}>
            <Typography variant="body2" color="text.secondary">
              {labels[hover !== -1 ? hover : value]}
            </Typography>
          </Box>
        </Box>

        <Box component="form" sx={{ display: "flex", flexDirection: "column", gap: 3 }} onSubmit={handleSubmit}>
          <FormControl required fullWidth>
            <InputLabel>Topic</InputLabel>
            <Select
              value={selectedTopic}
              onChange={(e) => setSelectedTopic(e.target.value)}
              label="Topic"
            >
              {["Service Quality", "Support Team", "Platform UI", "Response Time", "Pricing", "Other"]
                .map((item) => (
                  <MenuItem key={item} value={item}>{item}</MenuItem>
                ))}
            </Select>
          </FormControl>

          <TextField
            required
            label="Feedback"
            multiline
            rows={5}
            fullWidth
            value={feedbackText}
            onChange={(e) => setFeedbackText(e.target.value)}
          />

          <Button type="submit" variant="contained" sx={{ alignSelf: "flex-end", backgroundColor: "#558b2f" }}>
            Submit Your Feedback
          </Button>
        </Box>
      </Paper>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        message={<span style={{ width: '100%', textAlign: 'center' }}>{msg}</span>}
      />
    </Box>
  );
};

// Complaint Component
const ComplaintContent = () => {
  const [selectedTopic, setSelectedTopic] = useState('');
  const [complaintText, setComplaintText] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [msg, setMsg] = useState('');
  const { investorUUID, AccessToken } = useSelector((state) => state.auth || {});

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!investorUUID || !AccessToken) return;

    const data = { topic: selectedTopic, complaint: complaintText };

    try {
      const response = await axios.post(
        `http://localhost:5000/api/v1/complaint/createComplaint/${investorUUID}`,
        data,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${AccessToken}`,
          },
        }
      );
      setMsg(response.data.message || "Complaint submitted successfully!");
      setSnackbarOpen(true);
      setSelectedTopic('');
      setComplaintText('');
    } catch (error) {
      console.error("Complaint error:", error);
      setMsg("Failed to submit complaint.");
      setSnackbarOpen(true);
    }
  };

  return (
    <Box sx={{ mt: 4, px: 2 }}>
      <Paper elevation={4} sx={{ p: 4, maxWidth: 700, mx: "auto", borderRadius: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: "bold", mb: 3, textAlign: "center", color: "#ffa000" }}>
          Submit a Complaint
        </Typography>

        <Box component="form" sx={{ display: "flex", flexDirection: "column", gap: 3 }} onSubmit={handleSubmit}>
          <FormControl required fullWidth>
            <InputLabel>Topic</InputLabel>
            <Select
              value={selectedTopic}
              label="Topic"
              onChange={(e) => setSelectedTopic(e.target.value)}
            >
              {["Service Issue", "Technical Bug", "Payment Problem", "Slow Response", "Other"]
                .map((item) => (
                  <MenuItem key={item} value={item}>{item}</MenuItem>
                ))}
            </Select>
          </FormControl>

          <TextField
            required
            label="Complaint"
            multiline
            rows={5}
            fullWidth
            value={complaintText}
            onChange={(e) => setComplaintText(e.target.value)}
          />

          <Box sx={{ textAlign: "right" }}>
            <Button type="submit" variant="contained" sx={{ backgroundColor: "#558b2f" }}>
              Submit Your Complaint
            </Button>
          </Box>
        </Box>
      </Paper>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        message={<span style={{ width: '100%', textAlign: 'center' }}>{msg}</span>}
      />
    </Box>
  );
};

// Contact Us Component
const ContactUs = () => (
  <Box sx={{ mt: 4, px: 2 }}>
    <Paper elevation={4} sx={{ p: 4, maxWidth: 700, mx: "auto", borderRadius: 3 }}>
      <Typography variant="body1" sx={{ textAlign: "center" }}>
        You can reach us by email at{' '}
        <a
          href="https://mail.google.com/mail/?view=cm&fs=1&to=mrfranchisc22@gmail.com"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "#1976d2", textDecoration: "underline" }}
        >
          mrfranchisc22@gmail.com
        </a>
      </Typography>
    </Paper>
  </Box>
);

// Response Manager Main Component
const ResponseManager = () => {
  const [openCategory, setOpenCategory] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);

  const data = {
    Category: ["Contact Us", "Feedback", "Complaint"]
  };

  const handleToggle = (category) => {
    setOpenCategory((prev) => (prev === category ? null : category));
    setSelectedItem(null);
  };

  const renderContent = (item) => {
    if (item === "Feedback") return <FeedBack />;
    if (item === "Complaint") return <ComplaintContent />;
    if (item === "Contact Us") return <ContactUs />;
    return null;
  };

  return (
    <Box>
      <Typography
        variant="h6"
        fontWeight={600}
        mb={2}
        sx={{
          textAlign: "center",
          color: "#fafafa",
          backgroundColor: "#689f38",
          padding: "10px",
          borderRadius: "5px",
        }}
      >
        Response Manager
      </Typography>

      <Box sx={{
        display: 'flex',
        border: '1px solid #ddd',
        borderRadius: 2,
        maxHeight: 600,
        overflow: 'hidden',
      }}>
        {/* Sidebar */}
        <Box sx={{ width: 250, borderRight: '1px solid #ccc', overflowY: 'auto' }}>
          <List disablePadding>
            <ListItemButton onClick={() => handleToggle("Category")}>
              <ListItemText primary="Category" />
              {openCategory === "Category" ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>

            <Collapse in={openCategory === "Category"} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {data.Category.map((item, index) => (
                  <ListItemButton
                    key={index}
                    sx={{ pl: 4 }}
                    selected={selectedItem === item}
                    onClick={() => setSelectedItem(item)}
                  >
                    <ListItemText primary={item} />
                  </ListItemButton>
                ))}
              </List>
            </Collapse>
          </List>
        </Box>

        {/* Right Content */}
        <Box sx={{ flexGrow: 1, p: 2, overflowY: 'auto' }}>
          {selectedItem ? renderContent(selectedItem) : (
            <Typography sx={{ textAlign: 'center', mt: 1, backgroundColor: "#e2faa7", color: "#f29724" }}>
              Select a category to view its content.
            </Typography>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default ResponseManager;
