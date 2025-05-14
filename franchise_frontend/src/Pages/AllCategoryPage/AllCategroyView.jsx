import React, { useState, useEffect } from 'react';
import { 
  Container, Box, Typography, Grid, Card, CardMedia, CardContent, 
  CardActions, Button, Divider, Breadcrumbs, Link, Dialog, 
  DialogTitle, DialogContent, DialogActions, IconButton, Tabs, Tab,
  CircularProgress
} from '@mui/material';
import { 
  Business, LocationOn, Phone, Email, Language, Close,
  Description, Image, Receipt, Assignment, MenuBook, 
  HomeWork, CreditCard, PermIdentity
} from '@mui/icons-material';
import axios from 'axios';

function BrandDocumentsViewer() {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get('http://localhost:5000/api/v1/brandlisting/getAllBrandListing', {
          headers: {
            'Content-Type': 'application/json',
          },
        });
        console.log(response.data);
        
        setBrands(response.data.data);
      } catch (err) {
        setError(err.message || 'Failed to fetch brands');
      } finally {
        setLoading(false);
      }
    };

    fetchBrands();
  }, []);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleOpenBrand = (brand) => {
    setSelectedBrand(brand);
  };

  const handleCloseBrand = () => {
    setSelectedBrand(null);
  };
 const handleImageError = (e) => {
    e.target.src = 'https://via.placeholder.com/300';
    e.target.alt = 'Image not available';
  };
 
  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 3 }}>
        <Link color="inherit" href="/">
          Home
        </Link>
        <Typography color="text.primary">Brand Documents</Typography>
      </Breadcrumbs>

      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
          <CircularProgress />
        </Box>
      ) : error ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
          <Typography color="error">{error}</Typography>
        </Box>
      ) : (
        <>
          <Typography variant="h4" gutterBottom>
            Available Brands
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 3 }}>
            Click on a brand to view its documents
          </Typography>
          <Divider sx={{ mb: 3 }} />

          <Grid container spacing={3}>
            {brands.map((brand) => (
              <Grid item xs={12} sm={6} md={4} key={brand._id}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <CardMedia
                    component="img"
                    height="200"
                    image={brand.Documentation?.brandLogo || 'https://via.placeholder.com/300'}
                    alt={brand.BrandDetails?.brandName}
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography gutterBottom variant="h5" component="div">
                      {brand.BrandDetails?.brandName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      <Business sx={{ verticalAlign: 'middle', mr: 1 }} />
                      {brand.BrandDetails?.categories?.[0] || 'No category specified'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      <LocationOn sx={{ verticalAlign: 'middle', mr: 1 }} />
                      {brand.BrandDetails?.address || 'Address not provided'}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button 
                      size="small" 
                      onClick={() => handleOpenBrand(brand)}
                      startIcon={<Description />}
                    >
                      View Documents
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </>
      )}

      {/* Brand Documents Dialog */}
      <Dialog 
        open={!!selectedBrand} 
        onClose={handleCloseBrand}
        fullWidth
        maxWidth="lg"
      >
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h5">
              {selectedBrand?.BrandDetails?.brandName} - Documents
            </Typography>
            <IconButton onClick={handleCloseBrand}>
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent dividers>
          <Tabs value={activeTab} onChange={handleTabChange} sx={{ mb: 2 }}>
            <Tab label="Brand Details" icon={<Business />} />
            <Tab label="Legal Documents" icon={<Receipt />} />
            <Tab label="Gallery" icon={<Image />} />
          </Tabs>

          {activeTab === 0 && (
            <Box>
              <Typography variant="h6" gutterBottom>
                <Business sx={{ mr: 1 }} /> Brand Information
              </Typography>
              <Typography variant="body1" paragraph>
                <strong>Company Name:</strong> {selectedBrand?.BrandDetails?.companyName}
              </Typography>
              <Typography variant="body1" paragraph>
                <strong>Description:</strong> {selectedBrand?.BrandDetails?.description}
              </Typography>
              <Typography variant="body1" paragraph>
                <strong>Address:</strong> {selectedBrand?.BrandDetails?.address}
              </Typography>
              <Typography variant="body1" paragraph>
                <strong>Contact:</strong> {selectedBrand?.BrandDetails?.whatsappNumber}
              </Typography>
              <Typography variant="body1" paragraph>
                <strong>Email:</strong> {selectedBrand?.BrandDetails?.email}
              </Typography>
              <Typography variant="body1" paragraph>
                <strong>Website:</strong> {selectedBrand?.BrandDetails?.website}
              </Typography>

              <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                <Assignment sx={{ mr: 1 }} /> Franchise Details
              </Typography>
              <Typography variant="body1" paragraph>
                <strong>Franchise Fee:</strong> {selectedBrand?.FranchiseModal?.franchiseFee}
              </Typography>
              <Typography variant="body1" paragraph>
                <strong>Royalty Fee:</strong> {selectedBrand?.FranchiseModal?.royaltyFee}
              </Typography>
              <Typography variant="body1" paragraph>
                <strong>Space Required:</strong> {selectedBrand?.FranchiseModal?.spaceRequired}
              </Typography>
            </Box>
          )}

          {activeTab === 1 && (
            <Box>
              <Typography variant="h6" gutterBottom>
                <Receipt sx={{ mr: 1 }} /> Legal Documents
              </Typography>
              {/* <Grid container spacing={2}>
                {selectedBrand?.Documentation?.brandLogo && (
                  <Grid item xs={12} sm={6} md={4}>
                    <Card>
                      <CardMedia
                        component="img"
                        height="140"
                        image={selectedBrand.Documentation.brandLogo}
                        alt="Brand Logo"
                      />
                      <CardContent>
                        <Typography gutterBottom variant="body1">
                          <Business sx={{ mr: 1 }} /> Brand Logo
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                )}
                {selectedBrand?.Documentation?.businessRegistration && (
                  <Grid item xs={12} sm={6} md={4}>
                    <Card>
                      <CardMedia
                        component="img"
                        height="140"
                        image={selectedBrand.Documentation.businessRegistration}
                        alt="Business Registration"
                      />
                      <CardContent>
                        <Typography gutterBottom variant="body1">
                          <Description sx={{ mr: 1 }} /> Business Registration
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                )}
                {selectedBrand?.Documentation?.gstCertificate && (
                  <Grid item xs={12} sm={6} md={4}>
                    <Card>
                      <CardMedia
                        component="img"
                        height="140"
                        image={selectedBrand.Documentation.gstCertificate}
                        alt="GST Certificate"
                      />
                      <CardContent>
                        <Typography gutterBottom variant="body1">
                          <Receipt sx={{ mr: 1 }} /> GST Certificate
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                )}
                {selectedBrand?.Documentation?.franchiseAgreement && (
                  <Grid item xs={12} sm={6} md={4}>
                    <Card>
                      <CardMedia
                        component="img"
                        height="140"
                        image={selectedBrand.Documentation.franchiseAgreement}
                        alt="Franchise Agreement"
                      />
                      <CardContent>
                        <Typography gutterBottom variant="body1">
                          <Assignment sx={{ mr: 1 }} /> Franchise Agreement
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                )}
                {selectedBrand?.Documentation?.menuCatalog && (
                  <Grid item xs={12} sm={6} md={4}>
                    <Card>
                      <CardMedia
                        component="img"
                        height="140"
                        image={selectedBrand.Documentation.menuCatalog}
                        alt="Menu Catalog"
                      />
                      <CardContent>
                        <Typography gutterBottom variant="body1">
                          <MenuBook sx={{ mr: 1 }} /> Menu Catalog
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                )}
                {selectedBrand?.Documentation?.fssaiLicense && (
                  <Grid item xs={12} sm={6} md={4}>
                    <Card>
                      <CardMedia
                        component="img"
                        height="140"
                        image={selectedBrand.Documentation.fssaiLicense}
                        alt="FSSAI License"
                      />
                      <CardContent>
                        <Typography gutterBottom variant="body1">
                          <Receipt sx={{ mr: 1 }} /> FSSAI License
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                )}
                {selectedBrand?.Documentation?.panCard && (
                  <Grid item xs={12} sm={6} md={4}>
                    <Card>
                      <CardMedia
                        component="img"
                        height="140"
                        image={selectedBrand.Documentation.panCard}
                        alt="PAN Card"
                      />
                      <CardContent>
                        <Typography gutterBottom variant="body1">
                          <CreditCard sx={{ mr: 1 }} /> PAN Card
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                )}
                {selectedBrand?.Documentation?.aadhaarCard && (
                  <Grid item xs={12} sm={6} md={4}>
                    <Card>
                      <CardMedia
                        component="img"
                        height="140"
                        image={selectedBrand.Documentation.aadhaarCard}
                        alt="Aadhaar Card"
                      />
                      <CardContent>
                        <Typography gutterBottom variant="body1">
                          <PermIdentity sx={{ mr: 1 }} /> Aadhaar Card
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                )}
              </Grid> */}
            </Box>
          )}

          {activeTab === 2 && (
            <Box>
              <Typography variant="h6" gutterBottom>
                <Image sx={{ mr: 1 }} /> Gallery
              </Typography>
              <Grid container spacing={2}>
                {selectedBrand?.Gallery?.mediaFiles?.map((media, index) => (
                  <Grid item xs={12} sm={6} md={4} key={index}>
                    <Card>
                      <CardMedia
                        component="img"
                        height="200"
                        image={media}
                        alt={`Gallery image ${index + 1}`}
                      />
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseBrand}>Close</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default BrandDocumentsViewer;