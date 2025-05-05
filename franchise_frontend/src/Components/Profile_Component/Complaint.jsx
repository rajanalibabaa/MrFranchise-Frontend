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
import StarIcon from '@mui/icons-material/Star';

const labels = {
  0.5: 'Useless',
  1: 'Useless+',
  1.5: 'Poor',
  2: 'Poor+',
  2.5: 'Ok',
  3: 'Ok+',
  3.5: 'Good',
  4: 'Good+',
  4.5: 'Excellent',
  5: 'Excellent+',
};

function getLabelText(value) {
  return `${value} Star${value !== 1 ? 's' : ''}, ${labels[value]}`;
}

function Complaint() {
  const [value, setValue] = useState(2);
  const [hover, setHover] = useState(-1);
  const [selectedTopic, setSelectedTopic] = useState('');

  return (
    <Box sx={{ mt: 8, px: 2, marginLeft: -20, padding: 4 }}>
      <Paper elevation={4} sx={{ p: 4, maxWidth: 700, mx: "auto", borderRadius: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: "bold", mb: 3, textAlign: "center", color: "#1976d2" }}>
          Submit a Complaint
        </Typography>

        {/* Rating Section */}
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 4 }}>
          <Rating
            name="hover-feedback"
            value={value}
            precision={0.5}
            getLabelText={getLabelText}
            onChange={(event, newValue) => setValue(newValue)}
            onChangeActive={(event, newHover) => setHover(newHover)}
            emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />}
          />
          <Box sx={{ ml: 2, minWidth: 100 }}>
            <Typography>{labels[hover !== -1 ? hover : value]}</Typography>
          </Box>
        </Box>

        {/* Form */}
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

          {/* Complaint Description */}
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

          {/* Submit Button */}
          <Box sx={{ textAlign: "right" }}>
            <Button type="submit" variant="contained" color="primary" sx={{ backgroundColor: "#558b2f" }}>
              Submit Complaint
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}

export default Complaint;
