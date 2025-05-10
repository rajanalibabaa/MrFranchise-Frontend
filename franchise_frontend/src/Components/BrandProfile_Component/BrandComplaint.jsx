import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Rating,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from "@mui/material";


function BrandComplaint() {
  
  const [selectedTopic, setSelectedTopic] = useState('');

  return (
    <Box sx={{ mt: 8, px: 2, marginLeft: -20, padding: 4 }}>
      <Paper elevation={4} sx={{ p: 4, maxWidth: 700, mx: "auto", borderRadius: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: "bold", mb: 3, textAlign: "center", color: "#ffa000" }}>
          Submit a Complaint
        </Typography>

        <Box
          component="form"
          sx={{ display: "flex", flexDirection: "column", gap: 3 }}
          onSubmit={(e) => {
            e.preventDefault();
            // handle complaint submission
          }}
        >
          {/* Topic Dropdown */}
          <FormControl required fullWidth size="small">
            <InputLabel id="complaint-topic-label">Topic</InputLabel>
            <Select
              labelId="complaint-topic-label"
              id="complaint-topic"
              value={selectedTopic}
              label="Topic"
              onChange={(e) => setSelectedTopic(e.target.value)}
            >
              <MenuItem value="Service Issue">Service Issue</MenuItem>
              <MenuItem value="Technical Bug">Technical Bug</MenuItem>
              <MenuItem value="Payment Problem">Payment Problem</MenuItem>
              <MenuItem value="Slow Response">Slow Response</MenuItem>
              <MenuItem value="Other">Other</MenuItem>
            </Select>
          </FormControl>

          
          <TextField
            required
            label="Complaint"
            placeholder="Describe your issue"
            variant="outlined"
            multiline
            rows={5}
            fullWidth
            size="small"
          />

          
          <Box sx={{ textAlign: "right" }}>
            <Button type="submit" variant="contained" color="primary" sx={{ backgroundColor: "#558b2f" }}>
              Submit Your Complaint
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}

export default BrandComplaint;
