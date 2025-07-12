import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  TextField,
  FormControl,
  FormLabel,
  FormControlLabel,
  Radio,
  RadioGroup,
  InputAdornment,
  Grid,
  Typography,
  Box,
  Select,
  MenuItem,
  InputLabel,
  Paper,
  Button,
  FormHelperText,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  FormGroup,
  Checkbox,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Tooltip,
  Autocomplete,
  CircularProgress
} from "@mui/material";
import categories from "../../../Pages/Registration/BrandLIstingRegister/BrandCategories";
import { Editor } from "@tinymce/tinymce-react";
import DeleteIcon from "@mui/icons-material/Delete";
import { InfoOutlined } from "@mui/icons-material";

const FranchiseDetails = () => {
  const { brandUUID } = useParams();
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

   useEffect(() => {
    const fetchBrandDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/v1/brandlisting/getBrandListingByUUID/${brandUUID}`
        );
        setBrandData(response.data?.data || {});
      } catch (error) {
        console.error('Error fetching brand details:', error);
      } finally {
        setLoading(false);
      }
    };

    if (brandUUID) fetchBrandDetails();
  }, [brandUUID]);

  const [selectedCategory, setSelectedCategory] = useState({
    groupId: data.brandCategories?.groupId || "",
    main: data.brandCategories?.main || "",
    sub: data.brandCategories?.sub || "",
    child: data.brandCategories?.child || "",
  });

  // Helper to format currency values
  const formatCurrency = (value) => {
    if (!value) return "";
    return value !== "No Fee" ? `${value}.Rs` : value;
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Typography color="error" sx={{ mt: 3, textAlign: "center" }}>
        Error: {error}
      </Typography>
    );
  }

  return (
    <Box sx={{ pr: 1, mr: { sm: 0, md: 10 }, ml: { sm: 0, md: 10 } }}>
      {/* Brand Categories Section */}
      <Typography variant="h6" fontWeight={700} sx={{ mb: 3, color: "#ff9800" }}>
        Brand Categories
      </Typography>

      <Grid
        container
        spacing={2}
        sx={{
          mt: 3,
          display: "grid",
          gridTemplateColumns: { md: "repeat(4, 1fr)", xs: "1fr" },
          gap: 2,
          mb: 2,
        }}
      >
        <Grid item xs={12} sm={4}>
          <FormControl fullWidth size="medium">
            <InputLabel>Industries</InputLabel>
            <Select
              value={selectedCategory.main || data.brandCategories?.main || ""}
              label="Industries"
              readOnly
            >
              {categories.map((category) => (
                <MenuItem key={category.name} value={category.name}>
                  {category.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={4}>
          <FormControl fullWidth size="medium">
            <InputLabel>Main Category</InputLabel>
            <Select
              value={selectedCategory.sub || data.brandCategories?.sub || ""}
              label="Main Category"
              readOnly
            >
              {data.brandCategories?.main &&
                categories
                  .find((cat) => cat.name === data.brandCategories.main)
                  ?.children?.map((subCategory) => (
                    <MenuItem key={subCategory.name} value={subCategory.name}>
                      {subCategory.name}
                    </MenuItem>
                  ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={4}>
          <FormControl fullWidth size="medium">
            <InputLabel>Sub Category</InputLabel>
            <Select
              value={selectedCategory.child || data.brandCategories?.child || ""}
              label="Sub Category"
              readOnly
            >
              {data.brandCategories?.sub &&
                categories
                  .find((cat) => cat.name === data.brandCategories.main)
                  ?.children?.find((sub) => sub.name === data.brandCategories.sub)
                  ?.children?.map((child, index) => (
                    <MenuItem key={index} value={child}>
                      {child}
                    </MenuItem>
                  ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>
     
      <Typography variant="h6" fontWeight={700} sx={{ mb: 3, color: "#ff9800" }}>
        Establishment & Franchise year Details
      </Typography>

      <Grid container spacing={2} sx={{
        display: "grid",
        gridTemplateColumns: { md: "repeat(4, 1fr)", xs: "1fr" },
      }}>
        <Grid item xs={12} sm={6} md={2.4}>
          <TextField
            label="Year Commenced Operations"
            variant="outlined"
            size="medium"
            value={data.establishedYear || ""}
            fullWidth
            InputProps={{ readOnly: true }}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={2.4}>
          <TextField
            label="Year Commenced Franchising"
            variant="outlined"
            size="medium"
            value={data.franchiseSinceYear || ""}
            fullWidth
            InputProps={{ readOnly: true }}
          />
        </Grid>
      </Grid>

      {/* Franchise Network */}
      <Typography variant="h6" fontWeight={700} sx={{ mt: 3, color: "#ff9800" }}>
        Franchise Network
      </Typography>

      <Grid container spacing={2} sx={{
        mt: 1,
        display: "grid",
        gridTemplateColumns: { md: "repeat(4, 1fr)", xs: "1fr" },
      }}>
        <Grid item xs={12} sm={6} md={2.4}>
          <TextField
            fullWidth
            label="Company Owned Outlets"
            value={data.companyOwnedOutlets || ""}
            InputProps={{ readOnly: true }}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={2.4}>
          <TextField
            fullWidth
            label="Franchise Outlets"
            value={data.franchiseOutlets || ""}
            InputProps={{ readOnly: true }}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={2.4}>
          <TextField
            fullWidth
            label="Total Outlets"
            value={data.totalOutlets || ""}
            InputProps={{ readOnly: true }}
          />
        </Grid>
      </Grid>

      {/* Franchise Models Section */}
      {data.fico?.length > 0 && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" fontWeight={700} sx={{ mb: 3, color: "#ff9800" }}>
            Franchise Business Models
          </Typography>

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Model</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Investment</TableCell>
                  <TableCell>Area Required</TableCell>
                  <TableCell>Agreement</TableCell>
                  <TableCell>Franchise Fee</TableCell>
                  <TableCell>Interior Cost</TableCell>
                  <TableCell>Stock Cost</TableCell>
                  <TableCell>Additional Cost</TableCell>
                  <TableCell>Working Capital</TableCell>
                  <TableCell>Royalty Fee</TableCell>
                  <TableCell>Break Even</TableCell>
                  <TableCell>ROI</TableCell>
                  <TableCell>Payback</TableCell>
                  <TableCell>Margin</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.fico.map((model, index) => (
                  <TableRow key={index}>
                    <TableCell>{model.franchiseModel}</TableCell>
                    <TableCell>{model.franchiseType}</TableCell>
                    <TableCell>{model.investmentRange}</TableCell>
                    <TableCell>{model.areaRequired}</TableCell>
                    <TableCell>{model.agreementPeriod}</TableCell>
                    <TableCell>{formatCurrency(model.franchiseFee)}</TableCell>
                    <TableCell>{formatCurrency(model.interiorCost)}</TableCell>
                    <TableCell>{formatCurrency(model.stockInvestment)}</TableCell>
                    <TableCell>{formatCurrency(model.otherCost)}</TableCell>
                    <TableCell>{formatCurrency(model.requireWorkingCapital)}</TableCell>
                    <TableCell>
                      {model.royaltyFee && model.royaltyFee !== "No Fee" 
                        ? `${model.royaltyFee}${model.royaltyFeeUnit === "%" ? "%" : ""}`
                        : model.royaltyFee}
                    </TableCell>
                    <TableCell>{model.breakEven}</TableCell>
                    <TableCell>{model.roi}%</TableCell>
                    <TableCell>{model.payBackPeriod}</TableCell>
                    <TableCell>{model.marginOnSales}%</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}

      {/* Support and Training Section */}
      <Grid item xs={12} sx={{ mt: 4 }}>
        <Typography variant="h6" color="#ff9800" sx={{ fontWeight: "bold" }}>
          Support and Training
        </Typography>

        <Grid container spacing={2} sx={{ mt: 2 }}>
          <Grid item xs={12} md={6}>
            <Typography>
              <strong>Aid in Financing:</strong> {data.aidFinancing || "N/A"}
            </Typography>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Typography>
              <strong>Franchise Development Consultation:</strong> {data.franchiseDevelopment || "N/A"}
            </Typography>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Typography>
              <strong>Marketing Recruitment Consultation:</strong> {data.consultationOrAssistance || "N/A"}
            </Typography>
          </Grid>
          
          {data.trainingSupport?.length > 0 && (
            <Grid item xs={12}>
              <Typography><strong>Training Support:</strong></Typography>
              <ul>
                {data.trainingSupport.map((support, index) => (
                  <li key={index}>{support}</li>
                ))}
              </ul>
            </Grid>
          )}
        </Grid>
      </Grid>

      {/* Brand Description Section */}
      <Grid item xs={12} sx={{ mt: 4 }}>
        <Typography variant="h6" color="#ff9800" sx={{ fontWeight: "bold" }}>
          Brand Description
        </Typography>

        {data.uniqueSellingPoints?.length > 0 && (
          <Box sx={{ mt: 2, mb: 3 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
              Unique Selling Points:
            </Typography>
            <ul>
              {data.uniqueSellingPoints.map((usp, index) => (
                <li key={index}>{usp}</li>
              ))}
            </ul>
          </Box>
        )}

        {data.brandDescription && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: "bold", mb: 1 }}>
              Brand Description:
            </Typography>
            <div dangerouslySetInnerHTML={{ __html: data.brandDescription }} />
          </Box>
        )}
      </Grid>
    </Box>
  );
};

export default FranchiseDetails;