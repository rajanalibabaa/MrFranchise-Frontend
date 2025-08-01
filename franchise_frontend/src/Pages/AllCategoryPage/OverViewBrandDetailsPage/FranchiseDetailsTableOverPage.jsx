import React, { useState, useEffect, useRef } from "react";
import {
  TableContainer,
  Table,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
  Box,
  Fade,
  Typography,
  useTheme,
  useMediaQuery
} from "@mui/material";

const FranchiseDetailsTable = ({ data, isMobile }) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));
  const [autoScroll, setAutoScroll] = useState(true);
  const [isScrolling, setIsScrolling] = useState(false);
  const containerRef = useRef(null);
  const scrollIntervalRef = useRef(null);
  const touchStartPosRef = useRef(null);

  // Column configuration with flexible widths
  const columns = [
    { header: "Model", field: "franchiseModel", width: 150 },
    { header: "Type", field: "franchiseType", width: 120 },
    { header: "Investment", field: "investmentRange", width: 150 },
    { header: "Area", field: "areaRequired", width: 120 },
    { header: "Agreement", field: "agreementPeriod", width: 120, format: (val) => val ? `${val} yrs` : "N/A" },
    { header: "Franchise Fee", field: "franchiseFee", width: 150, format: (val) => val ? `₹${Number(val).toLocaleString("en-IN")}` : "N/A" },
    { header: "Interior Cost", field: "interiorCost", width: 150, format: (val) => val ? `₹${Number(val).toLocaleString("en-IN")}` : "N/A" },
    { header: "Stock", field: "stockInvestment", width: 150, format: (val) => val ? `₹${Number(val).toLocaleString("en-IN")}` : "N/A" },
    { header: "Other Costs", field: "otherCost", width: 150, format: (val) => val ? `₹${Number(val).toLocaleString("en-IN")}` : "N/A" },
    { header: "Working Capital", field: "requireWorkingCapital", width: 180, format: (val) => val ? `₹${Number(val).toLocaleString("en-IN")}` : "N/A" },
    { header: "Royalty Fee", field: "royaltyFee", width: 150 },
    { header: "Break Even", field: "breakEven", width: 150 },
    { header: "ROI", field: "roi", width: 100, format: (val) => val ? `${val}%` : "N/A" },
    { header: "Payback", field: "payBackPeriod", width: 150 },
    { header: "Margin", field: "marginOnSales", width: 120, format: (val) => val ? `${val}%` : "N/A" },
  ];

  // Calculate total width for the table
  const tableWidth = columns.reduce((sum, col) => sum + col.width, 0);

  // Auto-scroll logic
  useEffect(() => {
    if (!isMobile || !containerRef.current) return;

    const container = containerRef.current;
    let scrollSpeed = 1;
    let scrollDirection = 1; // 1 for right, -1 for left

    const startAutoScroll = () => {
      scrollIntervalRef.current = setInterval(() => {
        if (!container) return;
        
        // Check if we've reached the end
        if (container.scrollLeft >= (container.scrollWidth - container.clientWidth)) {
          scrollDirection = -1; // Reverse direction
        } else if (container.scrollLeft <= 0) {
          scrollDirection = 1; // Reverse direction
        }
        
        container.scrollLeft += scrollSpeed * scrollDirection;
      }, 30);
    };

    const stopAutoScroll = () => {
      if (scrollIntervalRef.current) {
        clearInterval(scrollIntervalRef.current);
        scrollIntervalRef.current = null;
      }
    };

    if (autoScroll && !isScrolling) {
      startAutoScroll();
    } else {
      stopAutoScroll();
    }

    return () => stopAutoScroll();
  }, [isMobile, autoScroll, isScrolling]);

  // Handle touch events
  const handleTouchStart = (e) => {
    touchStartPosRef.current = e.touches[0].clientX;
    setAutoScroll(false);
    setIsScrolling(true);
  };

  const handleTouchMove = (e) => {
    if (!touchStartPosRef.current) return;
    const touchX = e.touches[0].clientX;
    const diff = touchStartPosRef.current - touchX;
    
    if (Math.abs(diff) > 5) { // Threshold to distinguish from taps
      setIsScrolling(true);
    }
  };

  const handleTouchEnd = () => {
    touchStartPosRef.current = null;
    setIsScrolling(false);
    
    // Restart auto-scroll after a delay if user isn't interacting
    const restartDelay = 3000; // 3 seconds
    setTimeout(() => {
      if (!touchStartPosRef.current) {
        setAutoScroll(true);
      }
    }, restartDelay);
  };

  // Handle mouse interactions
  const handleMouseEnter = () => {
    setAutoScroll(false);
    setIsScrolling(true);
  };

  const handleMouseLeave = () => {
    setIsScrolling(false);
    // Restart auto-scroll after a delay
    setTimeout(() => {
      setAutoScroll(true);
    }, 3000);
  };

  return (
    <Box sx={{ mb: 4, width: '100%', overflow: 'hidden' }}>
      <Typography variant="h6" fontWeight={700} sx={{ mb: 2, color: "#7ad03a" }}>
        Franchise Details
      </Typography>
      
      <TableContainer
        ref={containerRef}
        sx={{
          borderRadius: "16px",
          overflowX: "auto",
          maxHeight: isSmallScreen ? "auto" : "calc(100vh - 300px)",
          display: "flex",
          '&::-webkit-scrollbar': {
            height: '8px',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: 'rgba(0,0,0,0.2)',
            borderRadius: '4px',
          },
          scrollBehavior: 'smooth', // Add smooth scrolling
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <Box sx={{ 
          display: "flex", 
          minWidth: isMobile ? tableWidth * 2 : tableWidth,
          transition: 'transform 0.3s ease' 
        }}>
          {/* Original Table */}
          <Table sx={{ width: tableWidth, tableLayout: "fixed", flexShrink: 0 }}>
            <TableHead>
              <TableRow>
                {columns.map((col, i) => (
                  <TableCell 
                    key={i} 
                    align="center" 
                    sx={{
                      ...headerCellStyle,
                      minWidth: col.width,
                      width: col.width
                    }}
                  >
                    {col.header}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((model, index) => (
                <TableRowComponent 
                  key={index} 
                  model={model} 
                  index={index} 
                  columns={columns}
                />
              ))}
            </TableBody>
          </Table>

          {/* Duplicate Table for seamless scroll */}
          {isMobile && (
            <Table sx={{ width: tableWidth, tableLayout: "fixed", flexShrink: 0 }}>
              <TableHead>
                <TableRow>
                  {columns.map((col, i) => (
                    <TableCell 
                      key={`dup-${i}`} 
                      align="center" 
                      sx={{
                        ...headerCellStyle,
                        minWidth: col.width,
                        width: col.width
                      }}
                    >
                      {col.header}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {data.map((model, index) => (
                  <TableRowComponent 
                    key={`dup-${index}`} 
                    model={model} 
                    index={index} 
                    columns={columns}
                  />
                ))}
              </TableBody>
            </Table>
          )}
        </Box>
      </TableContainer>
    </Box>
  );
};

const TableRowComponent = ({ model, index, columns }) => (
  <Fade in={true} timeout={index * 100}>
    <TableRow hover sx={{ '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' } }}>
      {columns.map((col, j) => {
        const value = model[col.field];
        const displayValue = col.format ? col.format(value) : value || "N/A";
        
        return (
          <TableCell 
            key={j} 
            align="center" 
            sx={{
              ...cellStyle(j, model),
              minWidth: col.width,
              width: col.width,
              whiteSpace: 'normal',
              wordBreak: 'break-word',
              py: 2,
              px: 1,
            }}
          >
            {displayValue}
          </TableCell>
        );
      })}
    </TableRow>
  </Fade>
);

const headerCellStyle = {
  backgroundColor: "#7ad03a",
  color: "black",
  fontWeight: 700,
  padding: "12px 8px",
  borderBottom: "none",
  position: 'sticky',
  top: 0,
  zIndex: 1,
};

const cellStyle = (index, model) => ({
  borderBottom: "1px solid rgba(0,0,0,0.05)",
  backgroundColor: 'background.paper',
  fontWeight: (
    (index === 12 && model.roi) || 
    (index === 14 && model.marginOnSales)
  ) ? 700 : 'inherit',
  color: (
    index === 12 && parseFloat(model.roi) > 20 ? "success.main" :
    index === 14 && parseFloat(model.marginOnSales) > 30 ? "success.main" :
    "inherit"
  ),
});

export default FranchiseDetailsTable;