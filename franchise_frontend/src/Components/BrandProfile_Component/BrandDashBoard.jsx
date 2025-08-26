import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Avatar,
  Tabs,
  Tab,
  Card,
  Grid,
  Button,
  CircularProgress,
  Divider,
  Table,
  TableContainer,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  useMediaQuery,
  useTheme,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CardContent,
  Tooltip,
} from "@mui/material";
import { useSelector } from "react-redux";
import axios from "axios";
import {
  Person,
  Visibility,
  ThumbUp,
  MailOutline,
  Search,
  Close,
  FilterList,
} from "@mui/icons-material";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import VisibilityIcon from "@mui/icons-material/Visibility";
import FavoriteIcon from "@mui/icons-material/Favorite";

// const API_BASE_URL = 'https://mrfranchisebackend.mrfranchise.in';
const API_BASE_URL = "http://localhost:5000/api/v1";
const colors = {
  primary: "#2c3e50",
  secondary: "#34495e",
  accent: "#3498db",
  background: "#f8f9fa",
  cardBackground: "#ffffff",
  textPrimary: "#2c3e50",
  textSecondary: "#7f8c8d",
  divider: "#ecf0f1",
};
const dateFilters = [
  { value: "all", label: "All Time" },
  { value: "3", label: "Last 3 Days" },
  { value: "7", label: "Last 7 Days" },
  { value: "30", label: "Last 30 Days" },
  { value: "90", label: "Last 90 Days" },
];

const BrandDashBoard = ({ selectedSection, sectionContent }) => {
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [locationFilter, setLocationFilter] = useState("all");
  const [matchTypeFilter, setMatchTypeFilter] = useState("all");
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const [tabValue, setTabValue] = useState(0);
  const [viewType, setViewType] = useState("investors");
  const [brandData, setBrandData] = useState({});
  const [viewsData, setViewsData] = useState({ brands: [], investors: [] });
  const [likedData, setLikedData] = useState([]);
  const [applyData, setApplyData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [investmentFilter, setInvestmentFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [Leads, setLeads] = useState([]);
  const brandUUID = useSelector((state) => state.auth.brandUUID);
  const token = useSelector((state) => state.auth.AccessToken);
  const uniqueInvestmentRanges = [
    ...new Set(applyData.map((item) => item.investmentRange)),
  ].filter(Boolean);

  const filterByDate = (items) => {
    if (dateFilter === "all") return items;
    const daysAgo = new Date();
    daysAgo.setDate(daysAgo.getDate() - parseInt(dateFilter));
    return items.filter(
      (item) =>
        new Date(
          item.createdAt || item.apply?.createdAt || item.like?.createdAt
        ) >= daysAgo
    );
  };

  const fetchData = async () => {
    if (!brandUUID || !token) return;
    try {
      setLoading(true);
      const endpoints = [
        axios.get(`${API_BASE_URL}/brandlisting/getBrandById/${brandUUID}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(
          `${API_BASE_URL}/instantapply/getAllInstaApply/${brandUUID}`,
          { headers: { Authorization: `Bearer ${token}` } }
        ),
        axios.get(
          `${API_BASE_URL}/instantapply/getInstantApplyLocationLeadControllerById/${brandUUID}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        ),
      ];
      const responses = await Promise.all(
        endpoints.map((p) => p.catch((e) => ({ error: e })))
      );
      const [brandRes, applyRes, leadsRes] = responses;
      if (brandRes.error) throw brandRes.error;
      setBrandData(brandRes.data?.success ? brandRes?.data?.data : {});
      if (applyRes.error) throw applyRes.error;
      setApplyData(applyRes.data?.success ? applyRes?.data?.data : []);
      if (leadsRes.error) throw leadsRes.error;
      setLeads(leadsRes.data?.success ? leadsRes?.data?.data : []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load data.");
    } finally {
      setLoading(false);
    }
  };
  // console.log("applyData :", applyData);
  // console.log("lead :", Leads);
  // console.log("brandData", brandData);

  useEffect(() => {
    fetchData();
  }, [brandUUID, token]);
  const filteredLikedData = filterByDate(likedData);
  const filteredLeadsData = filterByDate(applyData);

  const handleTabChange = (_, newValue) => {
    setTabValue(newValue);
    setSearchTerm("");
    setInvestmentFilter("all");
    setDateFilter("all");
  };

  const handleViewDetails = (item) => {
    setSelectedItem(item);
    setDetailDialogOpen(true);
  };

  const renderTableRow = (item, type) => {
    const isInvestor = type === "investor";
    const name = isInvestor
      ? item?.firstName
      : item?.brandDetails?.brandName || item?.fullName || "Unknown";
    const email = isInvestor
      ? item?.email
      : item?.brandDetails?.email || item?.email;
    const phone = isInvestor
      ? item?.mobileNumber || item?.whatsappNumber
      : item?.brandDetails?.mobileNumber ||
        item?.brandDetails?.whatsappNumber ||
        item?.mobileNumber;
    const image = isInvestor
      ? item?.profileImage
      : item?.uploads?.brandLogo?.[0];

    return (
      <TableRow
        key={item?.uuid}
        hover
        sx={{ "&:hover": { backgroundColor: colors.divider } }}
      >
        <TableCell>
          <Avatar
            src={image || "/default-avatar.png"}
            sx={{ bgcolor: colors.secondary }}
            as="image"
          />
        </TableCell>
        <TableCell sx={{ color: colors.textPrimary }}>{name}</TableCell>
        <TableCell sx={{ color: colors.textPrimary }}>
          {email || "N/A"}
        </TableCell>
        <TableCell sx={{ color: colors.textPrimary }}>
          {phone || "N/A"}
        </TableCell>
        <TableCell>
          <Button
            size="small"
            variant="outlined"
            aria-label="details"
            onClick={() => handleViewDetails(item)}
            sx={{
              color: colors.accent,
              borderColor: colors.accent,
              "&:hover": { backgroundColor: `${colors.accent}15` },
            }}
          >
            Details
          </Button>
        </TableCell>
      </TableRow>
    );
  };

  const renderTabContent = () => {
    if (loading)
      return (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "300px",
          }}
        >
          <CircularProgress size={60} sx={{ color: colors.accent }} />
        </Box>
      );

    if (error)
      return (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "200px",
            flexDirection: "column",
          }}
        >
          {/* <Typography color="error" variant="h6" gutterBottom>
            Error Loading Data
          </Typography>
          <Typography color={colors.textSecondary}>{error}</Typography>
          <Button
            variant="contained"
            aria-label="retry"
            sx={{
              mt: 2,
              backgroundColor: colors.accent,
              "&:hover": { backgroundColor: colors.secondary },
            }}
            onClick={fetchData}
          >
            Retry
          </Button> */}
          <Typography color={colors.textSecondary}>We noticed that no one has applied to your brand yet.</Typography>

        </Box>
      );

    switch (tabValue) {
      // case 0:
        // return (
        //   <Box mt={4}>
        //     <Box
        //       sx={{
        //         display: "flex",
        //         justifyContent: "space-between",
        //         alignItems: "center",
        //         mb: 2,
        //       }}
        //     >
        //       <Typography variant="h6" sx={{ color: colors.textPrimary }}>
        //         Total Enquiries: {filteredLeadsData.length}
        //       </Typography>
        //     </Box>

        //     {/* Filter Controls */}
        //     <Box
        //       sx={{
        //         display: "flex",
        //         flexDirection: isMobile ? "column" : "row",
        //         gap: 2,
        //         mb: 3,
        //         alignItems: "center",
        //       }}
        //     >
        //       {isMobile ? (
        //         <>
        //           <IconButton
        //             onClick={() => setFilterDialogOpen(true)}
        //             sx={{ alignSelf: "flex-end", color: colors.accent }}
        //           >
        //             <FilterList />
        //           </IconButton>

        //           <Dialog
        //             open={filterDialogOpen}
        //             onClose={() => setFilterDialogOpen(false)}
        //             fullWidth
        //             maxWidth="xs"
        //           >
        //             <DialogTitle
        //               sx={{
        //                 color: colors.textPrimary,
        //                 backgroundColor: colors.cardBackground,
        //               }}
        //             >
        //               Filter Enquiries
        //             </DialogTitle>
        //             <IconButton
        //               onClick={() => setFilterDialogOpen(false)}
        //               sx={{
        //                 position: "absolute",
        //                 right: 8,
        //                 top: 8,
        //                 color: colors.textSecondary,
        //               }}
        //             >
        //               <Close />
        //             </IconButton>

        //             <DialogContent
        //               sx={{ backgroundColor: colors.cardBackground }}
        //             >
        //               {/* Investment Range Filter */}
        //               <FormControl fullWidth sx={{ mt: 1 }}>
        //                 <InputLabel sx={{ color: colors.textSecondary }}>
        //                   Investment Range
        //                 </InputLabel>
        //                 <Select
        //                   label="Investment Range"
        //                   value={investmentFilter}
        //                   onChange={(e) => setInvestmentFilter(e.target.value)}
        //                   sx={{
        //                     "& .MuiOutlinedInput-notchedOutline": {
        //                       borderColor: colors.divider,
        //                     },
        //                     "&:hover .MuiOutlinedInput-notchedOutline": {
        //                       borderColor: colors.accent,
        //                     },
        //                   }}
        //                 >
        //                   <MenuItem value="all">All Ranges</MenuItem>
        //                   {uniqueInvestmentRanges.map((range) => (
        //                     <MenuItem key={range} value={range}>
        //                       {range}
        //                     </MenuItem>
        //                   ))}
        //                 </Select>
        //               </FormControl>

        //               {/* Child Category Filter */}
        //               <FormControl fullWidth sx={{ mt: 2 }}>
        //                 <InputLabel sx={{ color: colors.textSecondary }}>
        //                   Category
        //                 </InputLabel>
        //                 <Select
        //                   label="Category"
        //                   value={categoryFilter}
        //                   onChange={(e) => setCategoryFilter(e.target.value)}
        //                   sx={{
        //                     "& .MuiOutlinedInput-notchedOutline": {
        //                       borderColor: colors.divider,
        //                     },
        //                     "&:hover .MuiOutlinedInput-notchedOutline": {
        //                       borderColor: colors.accent,
        //                     },
        //                   }}
        //                 >
        //                   <MenuItem value="all">All Categories</MenuItem>
        //                   {[
        //                     ...new Set(
        //                       applyData.flatMap(
        //                         (lead) =>
        //                           lead.category
        //                             ?.map((c) => c.child)
        //                             .filter(Boolean) || []
        //                       )
        //                     ),
        //                   ].map((child) => (
        //                     <MenuItem key={child} value={child}>
        //                       {child}
        //                     </MenuItem>
        //                   ))}
        //                 </Select>
        //               </FormControl>

        //               {/* Location Filter */}
        //               <FormControl fullWidth sx={{ mt: 2 }}>
        //                 <InputLabel sx={{ color: colors.textSecondary }}>
        //                   Location
        //                 </InputLabel>
        //                 <Select
        //                   label="Location"
        //                   value={locationFilter}
        //                   onChange={(e) => setLocationFilter(e.target.value)}
        //                   sx={{
        //                     "& .MuiOutlinedInput-notchedOutline": {
        //                       borderColor: colors.divider,
        //                     },
        //                     "&:hover .MuiOutlinedInput-notchedOutline": {
        //                       borderColor: colors.accent,
        //                     },
        //                   }}
        //                 >
        //                   <MenuItem value="all">All Locations</MenuItem>
        //                   {[
        //                     ...new Set(
        //                       applyData.map(
        //                         (lead) => lead.location?.state || ""
        //                       )
        //                     ),
        //                   ]
        //                     .filter(Boolean)
        //                     .map((state) => (
        //                       <MenuItem key={state} value={state}>
        //                         {state}
        //                       </MenuItem>
        //                     ))}
        //                 </Select>
        //               </FormControl>

        //               {/* Date Filter */}
        //               <FormControl fullWidth sx={{ mt: 2 }}>
        //                 <InputLabel sx={{ color: colors.textSecondary }}>
        //                   Time Period
        //                 </InputLabel>
        //                 <Select
        //                   label="Time Period"
        //                   value={dateFilter}
        //                   onChange={(e) => setDateFilter(e.target.value)}
        //                   sx={{
        //                     "& .MuiOutlinedInput-notchedOutline": {
        //                       borderColor: colors.divider,
        //                     },
        //                     "&:hover .MuiOutlinedInput-notchedOutline": {
        //                       borderColor: colors.accent,
        //                     },
        //                   }}
        //                 >
        //                   {dateFilters.map((option) => (
        //                     <MenuItem key={option.value} value={option.value}>
        //                       {option.label}
        //                     </MenuItem>
        //                   ))}
        //                 </Select>
        //               </FormControl>
        //             </DialogContent>

        //             <DialogActions
        //               sx={{ backgroundColor: colors.cardBackground }}
        //             >
        //               <Button
        //                 onClick={() => {
        //                   setInvestmentFilter("all");
        //                   setCategoryFilter("all");
        //                   setLocationFilter("all");
        //                   setDateFilter("all");
        //                   setFilterDialogOpen(false);
        //                 }}
        //                 sx={{ color: colors.textSecondary }}
        //                 aria-label="reset"
        //               >
        //                 Reset
        //               </Button>
        //               <Button
        //                 variant="contained"
        //                 onClick={() => setFilterDialogOpen(false)}
        //                 sx={{
        //                   backgroundColor: colors.accent,
        //                   "&:hover": { backgroundColor: colors.secondary },
        //                 }}
        //                 aria-label="apply"
        //               >
        //                 Apply
        //               </Button>
        //             </DialogActions>
        //           </Dialog>
        //         </>
        //       ) : (
        //         <>
        //           {/* Desktop Filters */}
        //           <FormControl
        //             sx={{ minWidth: 200 }}
        //             size={isMobile ? "small" : "medium"}
        //           >
        //             <InputLabel sx={{ color: colors.textSecondary }}>
        //               Investment Range
        //             </InputLabel>
        //             <Select
        //               label="Investment Range"
        //               value={investmentFilter}
        //               onChange={(e) => setInvestmentFilter(e.target.value)}
        //               sx={{
        //                 "& .MuiOutlinedInput-notchedOutline": {
        //                   borderColor: colors.divider,
        //                 },
        //                 "&:hover .MuiOutlinedInput-notchedOutline": {
        //                   borderColor: colors.accent,
        //                 },
        //               }}
        //             >
        //               <MenuItem value="all">All Ranges</MenuItem>
        //               {uniqueInvestmentRanges.map((range) => (
        //                 <MenuItem key={range} value={range}>
        //                   {range}
        //                 </MenuItem>
        //               ))}
        //             </Select>
        //           </FormControl>

        //           <FormControl
        //             sx={{ minWidth: 200 }}
        //             size={isMobile ? "small" : "medium"}
        //           >
        //             <InputLabel sx={{ color: colors.textSecondary }}>
        //               Category
        //             </InputLabel>
        //             <Select
        //               label="Category"
        //               value={categoryFilter}
        //               onChange={(e) => setCategoryFilter(e.target.value)}
        //               sx={{
        //                 "& .MuiOutlinedInput-notchedOutline": {
        //                   borderColor: colors.divider,
        //                 },
        //                 "&:hover .MuiOutlinedInput-notchedOutline": {
        //                   borderColor: colors.accent,
        //                 },
        //               }}
        //             >
        //               <MenuItem value="all">All Categories</MenuItem>
        //               {[
        //                 ...new Set(
        //                   applyData.flatMap(
        //                     (lead) =>
        //                       lead.category
        //                         ?.map((c) => c.child)
        //                         .filter(Boolean) || []
        //                   )
        //                 ),
        //               ].map((child) => (
        //                 <MenuItem key={child} value={child}>
        //                   {child}
        //                 </MenuItem>
        //               ))}
        //             </Select>
        //           </FormControl>

        //           <FormControl
        //             sx={{ minWidth: 200 }}
        //             size={isMobile ? "small" : "medium"}
        //           >
        //             <InputLabel sx={{ color: colors.textSecondary }}>
        //               Location
        //             </InputLabel>
        //             <Select
        //               label="Location"
        //               value={locationFilter}
        //               onChange={(e) => setLocationFilter(e.target.value)}
        //               sx={{
        //                 "& .MuiOutlinedInput-notchedOutline": {
        //                   borderColor: colors.divider,
        //                 },
        //                 "&:hover .MuiOutlinedInput-notchedOutline": {
        //                   borderColor: colors.accent,
        //                 },
        //               }}
        //             >
        //               <MenuItem value="all">All Locations</MenuItem>
        //               {[
        //                 ...new Set(
        //                   applyData.map((lead) => lead.location?.state || "")
        //                 ),
        //               ]
        //                 .filter(Boolean)
        //                 .map((state) => (
        //                   <MenuItem key={state} value={state}>
        //                     {state}
        //                   </MenuItem>
        //                 ))}
        //             </Select>
        //           </FormControl>

        //           <FormControl
        //             sx={{ minWidth: 200 }}
        //             size={isMobile ? "small" : "medium"}
        //           >
        //             <InputLabel sx={{ color: colors.textSecondary }}>
        //               Time Period
        //             </InputLabel>
        //             <Select
        //               label="Time Period"
        //               value={dateFilter}
        //               onChange={(e) => setDateFilter(e.target.value)}
        //               sx={{
        //                 "& .MuiOutlinedInput-notchedOutline": {
        //                   borderColor: colors.divider,
        //                 },
        //                 "&:hover .MuiOutlinedInput-notchedOutline": {
        //                   borderColor: colors.accent,
        //                 },
        //               }}
        //             >
        //               {dateFilters.map((option) => (
        //                 <MenuItem key={option.value} value={option.value}>
        //                   {option.label}
        //                 </MenuItem>
        //               ))}
        //             </Select>
        //           </FormControl>
        //         </>
        //       )}
        //     </Box>

        //     {/* Enquiries Table */}
        //     {filterByDate(applyData).filter((lead) => {
        //       const searchLower = searchTerm.toLowerCase();
        //       const matchesSearch =
        //         !searchTerm ||
        //         lead.investorName?.toLowerCase().includes(searchLower) ||
        //         lead.investorEmail?.toLowerCase().includes(searchLower) ||
        //         lead.investorPhone?.includes(searchTerm) ||
        //         lead.location?.district?.toLowerCase().includes(searchLower) ||
        //         lead.location?.state?.toLowerCase().includes(searchLower) ||
        //         lead.location?.city?.toLowerCase().includes(searchLower);

        //       const matchesCategory =
        //         categoryFilter === "all" ||
        //         (lead.category &&
        //           lead.category.some((c) => c.child === categoryFilter));

        //       const matchesLocation =
        //         locationFilter === "all" ||
        //         lead.location?.state === locationFilter;

        //       const matchesInvestment =
        //         investmentFilter === "all" ||
        //         lead.investmentRange === investmentFilter;

        //       return (
        //         matchesSearch &&
        //         matchesCategory &&
        //         matchesLocation &&
        //         matchesInvestment
        //       );
        //     }).length > 0 ? (
        //       <TableContainer
        //         component={Paper}
        //         sx={{
        //           border: `1px solid ${colors.divider}`,
        //           boxShadow: "none",
        //         }}
        //       >
        //         <Table>
        //           <TableHead>
        //             <TableRow sx={{ backgroundColor: colors.primary }}>
        //               <TableCell sx={{ color: "#fff", fontWeight: 600 }}>
        //                 Full Name
        //               </TableCell>
        //               {!isMobile && (
        //                 <TableCell sx={{ color: "#fff", fontWeight: 600 }}>
        //                   Mobile
        //                 </TableCell>
        //               )}
        //               <TableCell sx={{ color: "#fff", fontWeight: 600 }}>
        //                 Location
        //               </TableCell>
        //               {!isTablet && (
        //                 <TableCell sx={{ color: "#fff", fontWeight: 600 }}>
        //                   Category
        //                 </TableCell>
        //               )}
        //               {!isTablet && (
        //                 <TableCell sx={{ color: "#fff", fontWeight: 600 }}>
        //                   Investment
        //                 </TableCell>
        //               )}
        //               <TableCell
        //                 align="right"
        //                 sx={{ color: "#fff", fontWeight: 600 }}
        //               >
        //                 Actions
        //               </TableCell>
        //             </TableRow>
        //           </TableHead>
        //           <TableBody>
        //             {filterByDate(applyData)
        //               .filter((lead) => {
        //                 const searchLower = searchTerm.toLowerCase();
        //                 const matchesSearch = !searchTerm || lead.invest;
        //                 orName?.toLowerCase().includes(searchLower) ||
        //                   lead.investorEmail
        //                     ?.toLowerCase()
        //                     .includes(searchLower) ||
        //                   lead.investorPhone?.includes(searchTerm) ||
        //                   lead.location?.district
        //                     ?.toLowerCase()
        //                     .includes(searchLower) ||
        //                   lead.location?.state
        //                     ?.toLowerCase()
        //                     .includes(searchLower) ||
        //                   lead.location?.city
        //                     ?.toLowerCase()
        //                     .includes(searchLower);

        //                 const matchesCategory =
        //                   categoryFilter === "all" ||
        //                   (lead.category &&
        //                     lead.category.some(
        //                       (c) => c.child === categoryFilter
        //                     ));

        //                 const matchesLocation =
        //                   locationFilter === "all" ||
        //                   lead.location?.state === locationFilter;

        //                 const matchesInvestment =
        //                   investmentFilter === "all" ||
        //                   lead.investmentRange === investmentFilter;

        //                 return (
        //                   matchesSearch &&
        //                   matchesCategory &&
        //                   matchesLocation &&
        //                   matchesInvestment
        //                 );
        //               })
        //               .map((lead, index) => (
        //                 <TableRow
        //                   key={index}
        //                   hover
        //                   sx={{
        //                     "&:hover": { backgroundColor: colors.divider },
        //                   }}
        //                 >
        //                   <TableCell sx={{ color: colors.textPrimary }}>
        //                     {lead?.investorName || "Unknown"}
        //                   </TableCell>
        //                   {!isMobile && (
        //                     <TableCell sx={{ color: colors.textPrimary }}>
        //                       {lead.investorPhone || "N/A"}
        //                     </TableCell>
        //                   )}
        //                   <TableCell sx={{ color: colors.textPrimary }}>
        //                     {[lead.location?.state]
        //                       .filter(Boolean)
        //                       .join(", ") || "N/A"}
        //                   </TableCell>
        //                   {!isTablet && (
        //                     <TableCell sx={{ color: colors.textPrimary }}>
        //                       {lead.category?.[0]?.child || "N/A"}
        //                     </TableCell>
        //                   )}
        //                   {!isTablet && (
        //                     <TableCell sx={{ color: colors.textPrimary }}>
        //                       {lead.investmentRange || "N/A"}
        //                     </TableCell>
        //                   )}
        //                   <TableCell align="right">
        //                     <Button
        //                       variant="outlined"
        //                       size="small"
        //                       onClick={() => handleViewDetails(lead)}
        //                       sx={{
        //                         color: colors.accent,
        //                         borderColor: colors.accent,
        //                         "&:hover": {
        //                           backgroundColor: `${colors.accent}15`,
        //                         },
        //                       }}
        //                       aria-label="details"
        //                     >
        //                       Details
        //                     </Button>
        //                   </TableCell>
        //                 </TableRow>
        //               ))}
        //           </TableBody>
        //         </Table>
        //       </TableContainer>
        //     ) : (
        //       <Box
        //         sx={{
        //           display: "flex",
        //           justifyContent: "center",
        //           alignItems: "center",
        //           height: "200px",
        //           flexDirection: "column",
        //           border: `1px dashed ${colors.divider}`,
        //           borderRadius: 2,
        //           backgroundColor: colors.cardBackground,
        //         }}
        //       >
        //         <Typography
        //           variant="h6"
        //           color={colors.textSecondary}
        //           gutterBottom
        //         >
        //           No enquiries found
        //         </Typography>
        //         <Typography variant="body2" color={colors.textSecondary}>
        //           {searchTerm ||
        //           investmentFilter !== "all" ||
        //           categoryFilter !== "all" ||
        //           locationFilter !== "all" ||
        //           dateFilter !== "all"
        //             ? "Try adjusting your search or filters"
        //             : "No enquiries have been recorded yet"}
        //         </Typography>
        //       </Box>
        //     )}
        //   </Box>
        // );
      case 0:
        return (
          <Box mt={4}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 2,
              }}
            >
              <Typography variant="h6" sx={{ color: colors.textPrimary }}>
                Total Leads: {filterByDate(Leads).length}
              </Typography>
            </Box>

            {/* Filter Controls */}
            <Box
              sx={{
                display: "flex",
                flexDirection: isMobile ? "column" : "row",
                gap: 2,
                mb: 3,
                alignItems: "center",
              }}
            >
              {isMobile ? (
                <>
                  <IconButton
                    onClick={() => setFilterDialogOpen(true)}
                    sx={{ alignSelf: "flex-end", color: colors.accent }}
                  >
                    <FilterList />
                  </IconButton>

                  <Dialog
                    open={filterDialogOpen}
                    onClose={() => setFilterDialogOpen(false)}
                    fullWidth
                    maxWidth="xs"
                  >
                    <DialogTitle
                      sx={{
                        color: colors.textPrimary,
                        backgroundColor: colors.cardBackground,
                      }}
                    >
                      Filter Leads
                    </DialogTitle>
                    <IconButton
                      onClick={() => setFilterDialogOpen(false)}
                      sx={{
                        position: "absolute",
                        right: 8,
                        top: 8,
                        color: colors.textSecondary,
                      }}
                    >
                      <Close />
                    </IconButton>

                    <DialogContent
                      sx={{ backgroundColor: colors.cardBackground }}
                    >
                      {/* Investment Range Filter */}
                      <FormControl fullWidth sx={{ mt: 1 }}>
                        <InputLabel sx={{ color: colors.textSecondary }}>
                          Investment Range
                        </InputLabel>
                        <Select
                          label="Investment Range"
                          value={investmentFilter}
                          onChange={(e) => setInvestmentFilter(e.target.value)}
                          sx={{
                            "& .MuiOutlinedInput-notchedOutline": {
                              borderColor: colors.divider,
                            },
                            "&:hover .MuiOutlinedInput-notchedOutline": {
                              borderColor: colors.accent,
                            },
                          }}
                        >
                          <MenuItem value="all">All Ranges</MenuItem>
                          {[
                            ...new Set(
                              Leads.map((lead) => lead.investmentRange)
                            ),
                          ]
                            .filter(Boolean)
                            .map((range) => (
                              <MenuItem key={range} value={range}>
                                {range}
                              </MenuItem>
                            ))}
                        </Select>
                      </FormControl>

                      {/* Child Category Filter */}
                      <FormControl fullWidth sx={{ mt: 2 }}>
                        <InputLabel sx={{ color: colors.textSecondary }}>
                          Category
                        </InputLabel>
                        <Select
                          label="Category"
                          value={categoryFilter}
                          onChange={(e) => setCategoryFilter(e.target.value)}
                          sx={{
                            "& .MuiOutlinedInput-notchedOutline": {
                              borderColor: colors.divider,
                            },
                            "&:hover .MuiOutlinedInput-notchedOutline": {
                              borderColor: colors.accent,
                            },
                          }}
                        >
                          <MenuItem value="all">All Categories</MenuItem>
                          {[
                            ...new Set(
                              Leads.flatMap(
                                (lead) =>
                                  lead.category
                                    ?.map((c) => c.child)
                                    .filter(Boolean) || []
                              )
                            ),
                          ].map((child) => (
                            <MenuItem key={child} value={child}>
                              {child}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>

                      {/* Location Filter */}
                      <FormControl fullWidth sx={{ mt: 2 }}>
                        <InputLabel sx={{ color: colors.textSecondary }}>
                          Location
                        </InputLabel>
                        <Select
                          label="Location"
                          value={locationFilter}
                          onChange={(e) => setLocationFilter(e.target.value)}
                          sx={{
                            "& .MuiOutlinedInput-notchedOutline": {
                              borderColor: colors.divider,
                            },
                            "&:hover .MuiOutlinedInput-notchedOutline": {
                              borderColor: colors.accent,
                            },
                          }}
                        >
                          <MenuItem value="all">All Locations</MenuItem>
                          {[
                            ...new Set(
                              Leads.map((lead) => lead.location?.state || "")
                            ),
                          ]
                            .filter(Boolean)
                            .map((state) => (
                              <MenuItem key={state} value={state}>
                                {state}
                              </MenuItem>
                            ))}
                        </Select>
                      </FormControl>

                      {/* Match Type Filter */}
                      <FormControl fullWidth sx={{ mt: 2 }}>
                        <InputLabel sx={{ color: colors.textSecondary }}>
                          Match Type
                        </InputLabel>
                        <Select
                          label="Match Type"
                          value={matchTypeFilter}
                          onChange={(e) => setMatchTypeFilter(e.target.value)}
                          sx={{
                            "& .MuiOutlinedInput-notchedOutline": {
                              borderColor: colors.divider,
                            },
                            "&:hover .MuiOutlinedInput-notchedOutline": {
                              borderColor: colors.accent,
                            },
                          }}
                        >
                          <MenuItem value="all">All Match Types</MenuItem>
                          <MenuItem value="perfect">Perfect Matches</MenuItem>
                          <MenuItem value="categoryAndInvest">
                            Category & Investment
                          </MenuItem>
                          <MenuItem value="categoryAndLocation">
                            Category & Location
                          </MenuItem>
                          <MenuItem value="investmentAndLocation">
                            Investment & Location
                          </MenuItem>
                        </Select>
                      </FormControl>

                      {/* Date Filter */}
                      <FormControl fullWidth sx={{ mt: 2 }}>
                        <InputLabel sx={{ color: colors.textSecondary }}>
                          Time Period
                        </InputLabel>
                        <Select
                          label="Time Period"
                          value={dateFilter}
                          onChange={(e) => setDateFilter(e.target.value)}
                          sx={{
                            "& .MuiOutlinedInput-notchedOutline": {
                              borderColor: colors.divider,
                            },
                            "&:hover .MuiOutlinedInput-notchedOutline": {
                              borderColor: colors.accent,
                            },
                          }}
                        >
                          {dateFilters.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                              {option.label}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </DialogContent>

                    <DialogActions
                      sx={{ backgroundColor: colors.cardBackground }}
                    >
                      <Button
                        onClick={() => {
                          setInvestmentFilter("all");
                          setCategoryFilter("all");
                          setLocationFilter("all");
                          setMatchTypeFilter("all");
                          setDateFilter("all");
                          setFilterDialogOpen(false);
                        }}
                        sx={{ color: colors.textSecondary }}
                        aria-label="reset"
                      >
                        Reset
                      </Button>
                      <Button
                        variant="contained"
                        onClick={() => setFilterDialogOpen(false)}
                        sx={{
                          backgroundColor: colors.accent,
                          "&:hover": { backgroundColor: colors.secondary },
                        }}
                        aria-label="apply"
                      >
                        Apply
                      </Button>
                    </DialogActions>
                  </Dialog>
                </>
              ) : (
                <>
                  {/* Desktop Filters */}
                  <FormControl
                    sx={{ minWidth: 200 }}
                    size={isMobile ? "small" : "medium"}
                  >
                    <InputLabel sx={{ color: colors.textSecondary }}>
                      Investment Range
                    </InputLabel>
                    <Select
                      label="Investment Range"
                      value={investmentFilter}
                      onChange={(e) => setInvestmentFilter(e.target.value)}
                      sx={{
                        "& .MuiOutlinedInput-notchedOutline": {
                          borderColor: colors.divider,
                        },
                        "&:hover .MuiOutlinedInput-notchedOutline": {
                          borderColor: colors.accent,
                        },
                      }}
                    >
                      <MenuItem value="all">All Ranges</MenuItem>
                      {[...new Set(Leads.map((lead) => lead.investmentRange))]
                        .filter(Boolean)
                        .map((range) => (
                          <MenuItem key={range} value={range}>
                            {range}
                          </MenuItem>
                        ))}
                    </Select>
                  </FormControl>

                  <FormControl
                    sx={{ minWidth: 200 }}
                    size={isMobile ? "small" : "medium"}
                  >
                    <InputLabel sx={{ color: colors.textSecondary }}>
                      Category
                    </InputLabel>
                    <Select
                      label="Category"
                      value={categoryFilter}
                      onChange={(e) => setCategoryFilter(e.target.value)}
                      sx={{
                        "& .MuiOutlinedInput-notchedOutline": {
                          borderColor: colors.divider,
                        },
                        "&:hover .MuiOutlinedInput-notchedOutline": {
                          borderColor: colors.accent,
                        },
                      }}
                    >
                      <MenuItem value="all">All Categories</MenuItem>
                      {[
                        ...new Set(
                          Leads.flatMap(
                            (lead) =>
                              lead.category
                                ?.map((c) => c.child)
                                .filter(Boolean) || []
                          )
                        ),
                      ].map((child) => (
                        <MenuItem key={child} value={child}>
                          {child}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <FormControl
                    sx={{ minWidth: 200 }}
                    size={isMobile ? "small" : "medium"}
                  >
                    <InputLabel sx={{ color: colors.textSecondary }}>
                      Location State
                    </InputLabel>
                    <Select
                      label="Location"
                      value={locationFilter}
                      onChange={(e) => setLocationFilter(e.target.value)}
                      sx={{
                        "& .MuiOutlinedInput-notchedOutline": {
                          borderColor: colors.divider,
                        },
                        "&:hover .MuiOutlinedInput-notchedOutline": {
                          borderColor: colors.accent,
                        },
                      }}
                    >
                      <MenuItem value="all">All Locations</MenuItem>
                      {[
                        ...new Set(
                          Leads.map((lead) => lead.location?.state || "")
                        ),
                      ]
                        .filter(Boolean)
                        .map((state) => (
                          <MenuItem key={state} value={state}>
                            {state}
                          </MenuItem>
                        ))}
                    </Select>
                  </FormControl>

                  <FormControl
                    sx={{ minWidth: 200 }}
                    size={isMobile ? "small" : "medium"}
                  >
                    <InputLabel sx={{ color: colors.textSecondary }}>
                      Location District
                    </InputLabel>
                    <Select
                      label="Location"
                      value={locationFilter}
                      onChange={(e) => setLocationFilter(e.target.value)}
                      sx={{
                        "& .MuiOutlinedInput-notchedOutline": {
                          borderColor: colors.divider,
                        },
                        "&:hover .MuiOutlinedInput-notchedOutline": {
                          borderColor: colors.accent,
                        },
                      }}
                    >
                      <MenuItem value="all">All Locations</MenuItem>
                      {[
                        ...new Set(
                          Leads.map((lead) => lead.location?.district || "")
                        ),
                      ]
                        .filter(Boolean)
                        .map((state) => (
                          <MenuItem key={state} value={state}>
                            {state}
                          </MenuItem>
                        ))}
                    </Select>
                  </FormControl>

                  {/* <FormControl
                    sx={{ minWidth: 200 }}
                    size={isMobile ? "small" : "medium"}
                  >
                    <InputLabel sx={{ color: colors.textSecondary }}>
                      Location City
                    </InputLabel>
                    <Select
                      label="Location"
                      value={locationFilter}
                      onChange={(e) => setLocationFilter(e.target.value)}
                      sx={{
                        "& .MuiOutlinedInput-notchedOutline": {
                          borderColor: colors.divider,
                        },
                        "&:hover .MuiOutlinedInput-notchedOutline": {
                          borderColor: colors.accent,
                        },
                      }}
                    >
                      <MenuItem value="all">All Locations</MenuItem>
                      {[
                        ...new Set(
                          Leads.map((lead) => lead.location?.city || "")
                        ),
                      ]
                        .filter(Boolean)
                        .map((state) => (
                          <MenuItem key={state} value={state}>
                            {state}
                          </MenuItem>
                        ))}
                    </Select>
                  </FormControl> */}

                  {/* <FormControl
                    sx={{ minWidth: 200 }}
                    size={isMobile ? "small" : "medium"}
                  >
                    <InputLabel sx={{ color: colors.textSecondary }}>
                      Match Type
                    </InputLabel>
                    <Select
                      label="Match Type"
                      value={matchTypeFilter}
                      onChange={(e) => setMatchTypeFilter(e.target.value)}
                      sx={{
                        "& .MuiOutlinedInput-notchedOutline": {
                          borderColor: colors.divider,
                        },
                        "&:hover .MuiOutlinedInput-notchedOutline": {
                          borderColor: colors.accent,
                        },
                      }}
                    >
                      <MenuItem value="all">All Match Types</MenuItem>
                      <MenuItem value="perfect">Perfect Matches</MenuItem>
                      <MenuItem value="categoryAndInvest">
                        Category & Investment
                      </MenuItem>
                      <MenuItem value="categoryAndLocation">
                        Category & Location
                      </MenuItem>
                      <MenuItem value="investmentAndLocation">
                        Investment & Location
                      </MenuItem>
                    </Select>
                  </FormControl> */}

                  <FormControl
                    sx={{ minWidth: 200 }}
                    size={isMobile ? "small" : "medium"}
                  >
                    <InputLabel sx={{ color: colors.textSecondary }}>
                      Time Period
                    </InputLabel>
                    <Select
                      label="Time Period"
                      value={dateFilter}
                      onChange={(e) => setDateFilter(e.target.value)}
                      sx={{
                        "& .MuiOutlinedInput-notchedOutline": {
                          borderColor: colors.divider,
                        },
                        "&:hover .MuiOutlinedInput-notchedOutline": {
                          borderColor: colors.accent,
                        },
                      }}
                    >
                      {dateFilters.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </>
              )}
            </Box>

            {/* Leads Table */}
            {filterByDate(Leads).filter((lead) => {
              const searchLower = searchTerm.toLowerCase();
              const matchesSearch =
                !searchTerm ||
                lead.investorName?.toLowerCase().includes(searchLower) ||
                lead.investorEmail?.toLowerCase().includes(searchLower) ||
                lead.investorPhone?.includes(searchTerm) ||
                lead.location?.district?.toLowerCase().includes(searchLower) ||
                lead.location?.state?.toLowerCase().includes(searchLower) ||
                lead.location?.city?.toLowerCase().includes(searchLower);

              const matchesCategory =
                categoryFilter === "all" ||
                (lead.category &&
                  lead.category.some((c) => c.child === categoryFilter));

              const matchesLocation =
                locationFilter === "all" ||
                lead.location?.state === locationFilter;

              const matchesInvestment =
                investmentFilter === "all" ||
                lead.investmentRange === investmentFilter;

              const matchesMatchType =
                matchTypeFilter === "all" ||
                (lead.brandMatches &&
                  lead.brandMatches.some(
                    (match) => match.matchType === matchTypeFilter
                  ));

              return (
                matchesSearch &&
                matchesCategory &&
                matchesLocation &&
                matchesInvestment &&
                matchesMatchType
              );
            }).length > 0 ? (
              <TableContainer
                component={Paper}
                sx={{
                  border: `1px solid ${colors.divider}`,
                  boxShadow: "none",
                }}
              >
                <Table>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: colors.primary }}>
                      <TableCell sx={{ color: "#fff", fontWeight: 600 }}>
                        Full Name
                      </TableCell>
                      {!isMobile && (
                        <TableCell sx={{ color: "#fff", fontWeight: 600 }}>
                          Mobile
                        </TableCell>
                      )}
                      <TableCell sx={{ color: "#fff", fontWeight: 600 }}>
                        Location
                      </TableCell>
                      {!isTablet && (
                        <TableCell sx={{ color: "#fff", fontWeight: 600 }}>
                          Category
                        </TableCell>
                      )}
                      {!isTablet && (
                        <TableCell sx={{ color: "#fff", fontWeight: 600 }}>
                          Investment
                        </TableCell>
                      )}

                      <TableCell
                        align="right"
                        sx={{ color: "#fff", fontWeight: 600 }}
                      >
                        Actions
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filterByDate(Leads)
                      .filter((lead) => {
                        const searchLower = searchTerm.toLowerCase();
                        const matchesSearch =
                          !searchTerm ||
                          lead.investorName
                            ?.toLowerCase()
                            .includes(searchLower) ||
                          lead.investorEmail
                            ?.toLowerCase()
                            .includes(searchLower) ||
                          lead.investorPhone?.includes(searchTerm) ||
                          lead.location?.district
                            ?.toLowerCase()
                            .includes(searchLower) ||
                          lead.location?.state
                            ?.toLowerCase()
                            .includes(searchLower) ||
                          lead.location?.city
                            ?.toLowerCase()
                            .includes(searchLower);

                        const matchesCategory =
                          categoryFilter === "all" ||
                          (lead.category &&
                            lead.category.some(
                              (c) => c.child === categoryFilter
                            ));

                        const matchesLocation =
                          locationFilter === "all" ||
                          lead.location?.state === locationFilter;

                        const matchesInvestment =
                          investmentFilter === "all" ||
                          lead.investmentRange === investmentFilter;

                        const matchesMatchType =
                          matchTypeFilter === "all" ||
                          (lead.brandMatches &&
                            lead.brandMatches.some(
                              (match) => match.matchType === matchTypeFilter
                            ));

                        return (
                          matchesSearch &&
                          matchesCategory &&
                          matchesLocation &&
                          matchesInvestment &&
                          matchesMatchType
                        );
                      })
                      .map((lead, index) => (
                        <TableRow
                          key={index}
                          hover
                          sx={{
                            "&:hover": { backgroundColor: colors.divider },
                          }}
                        >
                          <TableCell sx={{ color: colors.textPrimary }}>
                            {lead?.investorName || "Unknown"}
                          </TableCell>
                          {!isMobile && (
                            <TableCell sx={{ color: colors.textPrimary }}>
                              {lead.investorPhone || "N/A"}
                            </TableCell>
                          )}
                          <TableCell sx={{ color: colors.textPrimary }}>
                            {[lead.location?.state]
                              .filter(Boolean)
                              .join(", ") || "N/A"}
                          </TableCell>
                          {!isTablet && (
                            <TableCell sx={{ color: colors.textPrimary }}>
                              {lead.category?.[0]?.child || "N/A"}
                            </TableCell>
                          )}
                          {!isTablet && (
                            <TableCell sx={{ color: colors.textPrimary }}>
                              {lead.investmentRange || "N/A"}
                            </TableCell>
                          )}

                          <TableCell align="right">
                            <Button
                              variant="outlined"
                              size="small"
                              onClick={() => handleViewDetails(lead)}
                              sx={{
                                color:"black",
                                backgroundColor:"success.light",
                                "&:hover": {
                                  backgroundColor: `success.light`,
                       
                                },
                              }}
                              aria-label="details"
                            >
                              Details
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "200px",
                  flexDirection: "column",
                  border: `1px dashed ${colors.divider}`,
                  borderRadius: 2,
                  backgroundColor: colors.cardBackground,
                }}
              >
                <Typography
                  variant="h6"
                  color={colors.textSecondary}
                  gutterBottom
                >
                  No leads found
                </Typography>
                <Typography variant="body2" color={colors.textSecondary}>
                  {searchTerm ||
                  investmentFilter !== "all" ||
                  categoryFilter !== "all" ||
                  locationFilter !== "all" ||
                  matchTypeFilter !== "all" ||
                  dateFilter !== "all"
                    ? "Try adjusting your search or filters"
                    : "No leads have been recorded yet"}
                </Typography>
              </Box>
            )}
          </Box>
        );

      default:
        return null;
    }
  };

  const renderDetailDialog = () => (
    <Dialog
      open={detailDialogOpen}
      onClose={() => setDetailDialogOpen(false)}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: { backgroundColor: colors.cardBackground, borderRadius: 2 },
      }}
    >
      <DialogTitle
        sx={{
          color: "#fff",
          backgroundColor: colors.primary,
          borderBottom: `1px solid ${colors.divider}`,
        }}
      >
        {["Application", "View", "Like", "Lead"][tabValue]} Details
        <IconButton
          onClick={() => setDetailDialogOpen(false)}
          sx={{ position: "absolute", right: 8, top: 8, color: "#fff" }}
        >
          <Close />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers sx={{ backgroundColor: colors.cardBackground }}>
        {selectedItem && (
          <Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
              <Avatar
                src={
                  selectedItem?.profileImage ||
                  selectedItem?.uploads?.brandLogo?.[0] ||
                  "/default-avatar.png"
                }
                as="image"
                sx={{ width: 60, height: 60, bgcolor: colors.secondary }}
              />
              <Typography variant="h6" sx={{ color: colors.textPrimary }}>
                {selectedItem.fullName ||
                  selectedItem.brandDetails?.brandName ||
                  selectedItem.firstName ||
                  selectedItem.investorName ||
                  "Unknown"}
              </Typography>
            </Box>
            <Divider sx={{ my: 2, borderColor: colors.divider }} />
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography
                  variant="subtitle2"
                  sx={{ color: colors.textPrimary, fontWeight: "bold", mb: 1 }}
                >
                  Contact Information
                </Typography>
                <Typography sx={{ color: colors.textSecondary }}>
                  Mobile:{" "}
                  {selectedItem.mobileNumber ||
                    selectedItem?.brandDetails?.mobileNumber ||
                    selectedItem.investorPhone ||
                    "N/A"}
                </Typography>
                <Typography sx={{ color: colors.textSecondary }}>
                  Email:{" "}
                  {selectedItem.email ||
                    selectedItem?.brandDetails?.email ||
                    selectedItem.investorEmail ||
                    "N/A"}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6} sx={{ marginLeft: "auto" }}>
                <Typography
                  variant="subtitle2"
                  sx={{ color: colors.textPrimary, fontWeight: "bold", mb: 1 }}
                >
                  Location
                </Typography>
                <Typography
                  sx={{ color: colors.textSecondary, whiteSpace: "pre-line" }}
                >
                  {[
                    selectedItem.district,
                    selectedItem?.state,
                    selectedItem?.country,
                  ]
                    .filter(Boolean)
                    .join(", ") || [
                      selectedItem.location?.city,
                      selectedItem?.location?.district,
                      selectedItem?.location?.state,
                    ] ||
                    "N/A"}
                </Typography>
              </Grid>
              {selectedItem.investmentRange && (
                <Grid item xs={12} sm={6}>
                  <Typography
                    variant="subtitle2"
                    sx={{
                      color: colors.textPrimary,
                      fontWeight: "bold",
                      mb: 1,
                    }}
                  >
                    Investment Details
                  </Typography>
                  <Typography sx={{ color: colors.textSecondary }}>
                    Range: {selectedItem.investmentRange}
                  </Typography>
                  <Typography sx={{ color: colors.textSecondary }}>
                    Plan: {selectedItem.planToInvest || "N/A"}
                  </Typography>
                </Grid>
              )}
              <Grid item xs={12} sm={6} sx={{ marginLeft: "auto" }}>
                <Typography
                  variant="subtitle2"
                  sx={{ color: colors.textPrimary, fontWeight: "bold", mb: 1 }}
                >
                  Additional Info
                </Typography>
                <Typography sx={{ color: colors.textSecondary }}>
                  {(tabValue === 0 || tabValue === 3) &&
                    `Applied By: ${selectedItem.apply?.applyBy || "Unknown"}`}
                  <div>
                    {(tabValue === 0 || tabValue === 3) &&
                      `Applied On: ${new Date(
                        selectedItem.createdAt
                      ).toLocaleDateString()}`}
                  </div>
                  {tabValue === 1 &&
                    `Viewed On: ${new Date(
                      selectedItem.createdAt
                    ).toLocaleDateString()}`}
                  {tabValue === 2 &&
                    `Liked On: ${new Date(
                      selectedItem.createdAt
                    ).toLocaleDateString()}`}
                </Typography>
              </Grid>
              {selectedItem.message && (
                <Grid item xs={12}>
                  <Typography
                    variant="subtitle2"
                    sx={{ color: colors.textPrimary }}
                  >
                    Message
                  </Typography>
                  <Typography
                    sx={{ fontStyle: "italic", color: colors.textSecondary }}
                  >
                    {selectedItem.message}
                  </Typography>
                </Grid>
              )}
            </Grid>
          </Box>
        )}
      </DialogContent>
      <DialogActions
        sx={{
          backgroundColor: colors.cardBackground,
          borderTop: `1px solid ${colors.divider}`,
        }}
      >
        <Button
          onClick={() => setDetailDialogOpen(false)}
          sx={{ color: colors.textSecondary }}
          aria-label="close"
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );

  return (
    <Box sx={{ backgroundColor: colors.background, minHeight: "100vh", pb: 4 }}>
      <Box sx={{ px: isMobile ? 1 : 3, maxWidth: 1400, mx: "auto", p: 3 }}>
        {!selectedSection ? (
          <>
            <Card
              sx={{
                mb: 3,
                p: 3,
                display: "flex",
                flexDirection: isMobile ? "column" : "row",
                alignItems: "center",
                gap: 3,
                flexWrap: "wrap",
                backgroundColor: colors.cardBackground,
                border: `1px solid ${colors.divider}`,
                boxShadow: "none",
              }}
            >
              <Avatar
                src={brandData?.uploads?.logo || "/default-brand.png"}
                sx={{
                  width: isMobile ? 80 : 80,
                  height: isMobile ? 80 : 80,
                  border: `3px solid ${colors.accent}`,
                  bgcolor: colors.secondary,
                }}
                as="image"
              />
              <Box sx={{ flexGrow: 1, minWidth: 200 }}>
                <Typography
                  variant="h5"
                  fontWeight={600}
                  gutterBottom
                  sx={{ color: colors.textPrimary }}
                >
                  {brandData?.brandDetails?.brandName || "Your Brand"}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ color: colors.textSecondary }}
                  gutterBottom
                >
                  Member Id :{" "}
                  {brandData?.brandID || "Business type not specified"}
                </Typography>
              </Box>
              <Box>
                <Grid
                  container
                  spacing={3}
                  justifyContent="center"
                  sx={{ py: 2 }}
                >
                  {/* Views Card */}
                  <Grid item xs={12} sm={6} md={4}>
                    <Card
                      sx={{
                        minWidth: 120,
                        textAlign: "center",
                        boxShadow: "0 4px 20px 0 rgba(0,0,0,0.08)",
                        borderRadius: "12px",
                        transition: "all 0.3s ease",
                        "&:hover": {
                          transform: "translateY(-5px)",
                          boxShadow: "0 8px 25px 0 rgba(0,0,0,0.12)",
                        },
                        borderLeft: "4px solid #1976d2",
                        position: "relative",
                        overflow: "visible",
                      }}
                    >
                      <CardContent sx={{ py: 0, px: 2 }}>
                        <Box
                          sx={{
                            position: "absolute",
                            top: -20,
                            left: "50%",
                            transform: "translateX(-50%)",
                            bgcolor: "primary.main",
                            color: "white",
                            borderRadius: "50%",
                            width: 40,
                            height: 40,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            boxShadow: 3,
                          }}
                        >
                          <VisibilityIcon fontSize="medium" />
                        </Box>
                        <Box sx={{ display: "flex", gap: 5 }}>
                          <Typography
                            variant="subtitle1"
                            fontWeight="medium"
                            sx={{
                              color: "text.secondary",
                              mt: 3,
                              mb: 0,
                              ml: 3,
                            }}
                          >
                            Views
                          </Typography>
                          <Typography
                            variant="h5"
                            component="div"
                            fontWeight="bold"
                            color="error.main"
                            sx={{ mt: 3, mb: 0.5, mr: 3 }}
                          >
                            {brandData.totalViewCount}
                          </Typography>
                        </Box>
                        <Box
                          sx={{
                            height: 4,
                            background:
                              "linear-gradient(90deg, #1976d2 0%, rgba(25,118,210,0.3) 100%)",
                            position: "absolute",
                            bottom: 0,
                            left: 0,
                            right: 0,
                            borderBottomLeftRadius: "12px",
                            borderBottomRightRadius: "12px",
                          }}
                        />
                      </CardContent>
                    </Card>
                  </Grid>

                  {/* Likes Card */}
                  <Grid item xs={12} sm={6} md={4}>
                    <Card
                      sx={{
                        minWidth: 120,
                        textAlign: "center",
                        boxShadow: "0 4px 20px 0 rgba(0,0,0,0.08)",
                        borderRadius: "12px",
                        transition: "all 0.3s ease",
                        "&:hover": {
                          transform: "translateY(-5px)",
                          boxShadow: "0 8px 25px 0 rgba(0,0,0,0.12)",
                        },
                        borderLeft: "4px solid #f44336",
                        position: "relative",
                        overflow: "visible",
                      }}
                    >
                      <CardContent sx={{ py: 0, px: 2 }}>
                        <Box
                          sx={{
                            position: "absolute",
                            top: -20,
                            left: "50%",
                            transform: "translateX(-50%)",
                            bgcolor: "error.main",
                            color: "white",
                            borderRadius: "50%",
                            width: 40,
                            height: 40,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            boxShadow: 3,
                          }}
                        >
                          <FavoriteIcon fontSize="medium" />
                        </Box>
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 5 }}
                        >
                          <Typography
                            variant="subtitle1"
                            fontWeight="medium"
                            sx={{
                              color: "text.secondary",
                              mt: 3,
                              mb: 0,
                              ml: 3,
                            }}
                          >
                            Liked
                          </Typography>
                          <Typography
                            variant="h5"
                            component="div"
                            fontWeight="bold"
                            color="error.main"
                            sx={{ mt: 3, mb: 0.5, mr: 3 }}
                          >
                            {brandData.totalLikedCount}
                          </Typography>
                        </Box>
                        <Box
                          sx={{
                            height: 4,
                            background:
                              "linear-gradient(90deg, #f44336 0%, rgba(244,67,54,0.3) 100%)",
                            position: "absolute",
                            bottom: 0,
                            left: 0,
                            right: 0,
                            borderBottomLeftRadius: "12px",
                            borderBottomRightRadius: "12px",
                          }}
                        />
                      </CardContent>
                    </Card>
                  </Grid>

                  {/* Shortlist Card */}
                  <Grid item xs={12} sm={6} md={4}>
                    <Card
                      sx={{
                        minWidth: 120,
                        textAlign: "center",
                        boxShadow: "0 4px 20px 0 rgba(0,0,0,0.08)",
                        borderRadius: "12px",
                        transition: "all 0.3s ease",
                        "&:hover": {
                          transform: "translateY(-5px)",
                          boxShadow: "0 8px 25px 0 rgba(0,0,0,0.12)",
                        },
                        borderLeft: "4px solid #4caf50",
                        position: "relative",
                        overflow: "visible",
                      }}
                    >
                      <CardContent sx={{ py: 0, px: 2 }}>
                        <Box
                          sx={{
                            position: "absolute",
                            top: -20,
                            left: "50%",
                            transform: "translateX(-50%)",
                            bgcolor: "success.main",
                            color: "white",
                            borderRadius: "50%",
                            width: 40,
                            height: 40,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            boxShadow: 3,
                          }}
                        >
                          <BookmarkIcon fontSize="medium" />
                        </Box>
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 5 }}
                        >
                          <Typography
                            variant="subtitle1"
                            fontWeight="medium"
                            sx={{
                              color: "text.secondary",
                              mt: 3,
                              mb: 0,
                              ml: 3,
                            }}
                          >
                            SortList
                          </Typography>
                          <Typography
                            variant="h5"
                            component="div"
                            fontWeight="bold"
                            color="error.main"
                            sx={{ mt: 3, mb: 0.5, mr: 3 }}
                          >
                            {brandData.totalSortlistCount}
                          </Typography>
                        </Box>
                        <Box
                          sx={{
                            height: 4,
                            background:
                              "linear-gradient(90deg, #4caf50 0%, rgba(76,175,80,0.3) 100%)",
                            position: "absolute",
                            bottom: 0,
                            left: 0,
                            right: 0,
                            borderBottomLeftRadius: "12px",
                            borderBottomRightRadius: "12px",
                          }}
                        />
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              </Box>
            </Card>

            <Card
              sx={{
                mb: 3,
                backgroundColor: colors.cardBackground,
                border: `1px solid ${colors.divider}`,
                boxShadow: "none",
              }}
            >
              <Tabs
                value={tabValue}
                onChange={handleTabChange}
                variant={isMobile ? "scrollable" : "fullWidth"}
                scrollButtons="auto"
                sx={{
                  "& .MuiTabs-indicator": {
                    backgroundColor: "orange",
                    height: 3,
                  },
                }}
              >
                {["Leads"].map((label, index) => (
                  <Tab
                    key={index}
                    label={
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          px: 1,
                          py: 0.5,
                        }}
                      >
                        {
                          [
                            <Person />,
                            <Visibility />,
                            <ThumbUp />,
                            <MailOutline />,
                          ][index]
                        }
                        <Typography
                          variant="body2"
                          sx={{
                            textTransform: "none",
                            fontWeight: tabValue === index ? 600 : 400,
                            color:
                              tabValue === index
                                ? colors.textPrimary
                                : colors.textSecondary,
                          }}
                        >
                          {label}
                        </Typography>
                        <Box
                          sx={{
                            // backgroundColor:
                            //   tabValue === index
                            //     ? colors.accent
                            //     : colors.divider,
                            // color:
                            //   tabValue === index
                            //     ? "#fff"
                            //     : colors.textSecondary,
                            backgroundColor : "#39da39ff",
                            color :"#111b14ff",
                            borderRadius: "50%",
                            width: 24,
                            height: 24,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "0.75rem",
                            ml: 0.5,
                          }}
                        >
                          {[ Leads.length][index]}
                        </Box>
                      </Box>
                    }
                    sx={{
                      minWidth: "unset",
                      py: 1.5,
                      "&.Mui-selected": {
                        backgroundColor: `${colors.accent}10`,
                      },
                    }}
                  />
                ))}
                
              </Tabs>
            </Card>

            <Card
              sx={{
                p: isMobile ? 1 : 3,
                backgroundColor: colors.cardBackground,
                border: `1px solid ${colors.divider}`,
                boxShadow: "none",
              }}
            >
              {renderTabContent()}
            </Card>
            {renderDetailDialog()}
          </>
        ) : (
          sectionContent[selectedSection]
        )}
      </Box>
    </Box>
  );
};

export default BrandDashBoard;
