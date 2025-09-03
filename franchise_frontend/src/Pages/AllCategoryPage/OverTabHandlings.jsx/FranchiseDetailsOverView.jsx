
// FranchiseDetailsTable.jsx
import React, { useState, useRef } from "react";
import {
  Box,
  TableContainer,
  Table,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
  Typography,
} from "@mui/material";
import { Fade } from "@mui/material";
import { keyframes } from "@emotion/react";

const FranchiseDetailsTable = ({ ficoDetails, formatCurrency }) => {
  const [selectedModel, setSelectedModel] = useState(null);
  const containerRef = useRef(null);
  const [isUserScrolling, setIsUserScrolling] = useState(false);
  const [hasHoveredOnce, setHasHoveredOnce] = useState(false);

  const tableRows = ficoDetails.map((model, index) => (
    <Fade in={true} key={model._id || index} timeout={index * 100}>
      <TableRow
        hover
        selected={selectedModel?._id && model._id && selectedModel._id === model._id}
        sx={{ "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.04)" } }}
      >
        {[
          model.franchiseModel,
          model.franchiseType,
          model.investmentRange,
          model.areaRequired,
          model.agreementPeriod ? `${model.agreementPeriod} yrs` : "N/A",
          model.franchiseFee ? formatCurrency(model.franchiseFee) : "N/A",
          model.interiorCost ? formatCurrency(model.interiorCost) : "N/A",
          model.stockInvestment ? formatCurrency(model.stockInvestment) : "N/A",
          model.otherCost ? formatCurrency(model.otherCost) : "N/A",
          model.requireWorkingCapital ? formatCurrency(model.requireWorkingCapital) : "N/A",
          model.royaltyFee,
          model.breakEven,
          model.roi ? `${model.roi}%` : "N/A",
          model.payBackPeriod,
          model.marginOnSales ? `${model.marginOnSales}%` : "N/A",
        ].map((value, j) => (
          <TableCell
            key={j}
            align="center"
            sx={{
              borderBottom: "1px solid rgba(0,0,0,0.05)",
              padding: "16px",
              minWidth: j === 0 ? "180px" : "120px", // Adjust minimum widths as needed
              maxWidth: "200px",
              whiteSpace: "normal",
              wordBreak: "break-word",
              overflow: "visible",
              textOverflow: "unset",
              fontWeight:
                (j === 12 && model.roi) || (j === 14 && model.marginOnSales)
                  ? 700
                  : "inherit",
              color:
                j === 12 && parseFloat(model.roi) > 20
                  ? "success.main"
                  : j === 14 && parseFloat(model.marginOnSales) > 30
                  ? "success.main"
                  : "inherit",
            }}
          >
            {value || "N/A"}
          </TableCell>
        ))}
      </TableRow>
    </Fade>
  ));

  const handleUserScrollStart = () => {
    setIsUserScrolling(true);
  };

  const handleUserScrollEnd = () => {
    setIsUserScrolling(false);
  };

  const handleMouseEnter = () => {
    if (!hasHoveredOnce) {
      setHasHoveredOnce(true);
    }
  };

  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h6" fontWeight={700} sx={{ mb: 2, color: "#7ad03a" }}>
        Franchise Details
      </Typography>
     <TableContainer
  ref={containerRef}
  sx={{
    borderRadius: "16px",
    overflowX: "auto",
    overflowY: "auto",
    maxHeight: "calc(100vh - 300px)",
    WebkitOverflowScrolling: "touch", // smooth touch scroll
    cursor: "grab",                   // show grab cursor
    "&:active": { cursor: "grabbing" },
    "&::-webkit-scrollbar": {
      height: "8px",
    },
    "&::-webkit-scrollbar-thumb": {
      backgroundColor: "#7ad03a",
      borderRadius: "4px",
    },
  }}
  onTouchStart={handleUserScrollStart}
  onTouchEnd={handleUserScrollEnd}
  onMouseEnter={handleMouseEnter}
  onMouseDown={(e) => {
    const el = containerRef.current;
    el.isDown = true;
    el.startX = e.pageX - el.offsetLeft;
    el.scrollLeftStart = el.scrollLeft;
  }}
  onMouseLeave={() => {
    const el = containerRef.current;
    el.isDown = false;
  }}
  onMouseUp={() => {
    const el = containerRef.current;
    el.isDown = false;
  }}
  onMouseMove={(e) => {
    const el = containerRef.current;
    if (!el.isDown) return;
    e.preventDefault();
    const x = e.pageX - el.offsetLeft;
    const walk = (x - el.startX) * 1; // scroll speed
    el.scrollLeft = el.scrollLeftStart - walk;
  }}
>

        <Table
          stickyHeader
          sx={{
            minWidth: "100%",
            tableLayout: "auto", // Changed to auto for better content-based sizing
          }}
        >
          <TableHead>
            <TableRow>
              {[
                "Model", "Type", "Investment", "Area", "Agreement",
                "Franchise Fee", "Interior Cost", "Stock", "Other Costs",
                "Working Capital", "Royalty Fee", "Break Even", "ROI",
                "Payback", "Margin"
              ].map((header, i) => (
                <TableCell
                  key={i}
                  align="center"
                  sx={{
                    backgroundColor: "#7ad03a",
                    color: "black",
                    fontWeight: 700,
                    padding: "12px 16px",
                    borderBottom: "none",
                    whiteSpace: "nowrap",
                    minWidth: i === 0 ? "180px" : "120px", // Match cell widths
                    position: "sticky",
                    top: 0,
                    zIndex: 1,
                  }}
                >
                  {header}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>{tableRows}</TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default FranchiseDetailsTable;
