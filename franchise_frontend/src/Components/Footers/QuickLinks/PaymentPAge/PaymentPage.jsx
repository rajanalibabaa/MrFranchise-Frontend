import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Radio,
  RadioGroup,
  FormControlLabel,
  TextField,
  Paper,
  Divider,
  Avatar,
  Grid,
  InputAdornment,
  Badge,
  useTheme
} from '@mui/material';
import {
  ArrowBack,
  CreditCard,
  AccountBalance,
  Payment,
  QrCode,
  CheckCircle,
  LocalAtm
} from '@mui/icons-material';

const PaymentPage = ({ membership, banners, onBack, onSubmit }) => {
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [cardDetails, setCardDetails] = useState({
    number: '',
    name: '',
    expiry: '',
    cvv: ''
  });
  const [showQR, setShowQR] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const theme = useTheme();
  // Calculate amounts with GST (18%)
  const bannerTotal = banners.reduce((sum, banner) => sum + banner.price, 0);
  const subtotal = membership.price + bannerTotal;
  const gstAmount = Math.round(subtotal * 0.18);
  const totalAmount = subtotal + gstAmount;

  // Generate a random UPI transaction ID
  const [upiId] = useState(`UPI${Math.floor(100000 + Math.random() * 900000)}`);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCardDetails(prev => ({ ...prev, [name]: value }));
  };

  const handlePaymentSubmit = () => {
    if (paymentMethod === 'upi') {
      setShowQR(true);
      // Simulate payment success after 5 seconds
      setTimeout(() => {
        setPaymentSuccess(true);
        setTimeout(() => {
          onSubmit({
            membership,
            banners,
            paymentMethod,
            upiId,
            gstAmount,
            totalAmount,
            subtotal
          });
        }, 1500);
      }, 5000);
    } else {
      onSubmit({
        membership,
        banners,
        paymentMethod,
        cardDetails: paymentMethod === 'credit_card' ? cardDetails : null,
        gstAmount,
        totalAmount,
        subtotal
      });
    }
  };

  // Format card number as user types
  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    
    if (parts.length) {
      return parts.join(' ');
    }
    return value;
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
      <Button
        startIcon={<ArrowBack />}
        onClick={onBack}
        sx={{ mb: 3 }}
      >
        Back to selection
      </Button>

      <Typography variant="h4" sx={{ mb: 2, fontWeight: 700 }}>
        Complete Your Payment
      </Typography>

      {!paymentSuccess ? (
        <>
          {/* Order Summary */}
          <Paper elevation={3} sx={{ p: 3, mb: 4, borderRadius: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Order Summary
            </Typography>
            
            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography>{membership.metal} {membership.plan} Membership</Typography>
                <Typography fontWeight={600}>₹{membership.price.toLocaleString()}</Typography>
              </Box>
              
              {banners.length > 0 && (
                <>
                  <Typography variant="body2" sx={{ mt: 1, mb: 1, fontWeight: 600 }}>
                    Banner Ads:
                  </Typography>
                  {banners.map(banner => (
                    <Box key={banner.id} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2">{banner.name} ({banner.size})</Typography>
                      <Typography variant="body2">₹{banner.price.toLocaleString()}</Typography>
                    </Box>
                  ))}
                </>
              )}
            </Box>
            
            <Divider sx={{ my: 2 }} />
            
            <Box sx={{ mb: 1 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography>Subtotal:</Typography>
                <Typography>₹{subtotal.toLocaleString()}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography>GST (18%):</Typography>
                <Typography>₹{gstAmount.toLocaleString()}</Typography>
              </Box>
            </Box>
            
            <Divider sx={{ my: 2 }} />
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="h6">Total Amount:</Typography>
              <Typography variant="h6" fontWeight={700}>
                ₹{totalAmount.toLocaleString()}
              </Typography>
            </Box>
          </Paper>

          {!showQR ? (
            <>
              {/* Payment Methods */}
              {/* <Paper elevation={3} sx={{ p: 3, mb: 4, borderRadius: 3 }}>
                <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                  Select Payment Method
                </Typography>
                
                <RadioGroup
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                >
                  <FormControlLabel
                    value="upi"
                    control={<Radio />}
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center', ml: 1 }}>
                        <Avatar sx={{ bgcolor: '#5F9EA0', width: 24, height: 24, mr: 2 }}>
                          <Payment fontSize="small" />
                        </Avatar>
                        <Typography>UPI / Google Pay</Typography>
                      </Box>
                    }
                    sx={{ mb: 2 }}
                  />
                  
                  <FormControlLabel
                    value="credit_card"
                    control={<Radio />}
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center', ml: 1 }}>
                        <Avatar sx={{ bgcolor: '#FF7F50', width: 24, height: 24, mr: 2 }}>
                          <CreditCard fontSize="small" />
                        </Avatar>
                        <Typography>Credit/Debit Card</Typography>
                      </Box>
                    }
                    sx={{ mb: 2 }}
                  />
                  
                  <FormControlLabel
                    value="net_banking"
                    control={<Radio />}
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center', ml: 1 }}>
                        <Avatar sx={{ bgcolor: '#4682B4', width: 24, height: 24, mr: 2 }}>
                          <AccountBalance fontSize="small" />
                        </Avatar>
                        <Typography>Net Banking</Typography>
                      </Box>
                    }
                  />
                </RadioGroup>
              </Paper> */}

              {/* Payment Form */}
              {paymentMethod === 'credit_card' && (
                <Paper elevation={3} sx={{ p: 3, mb: 4, borderRadius: 3 }}>
                  <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                    Card Details
                  </Typography>
                  
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Card Number"
                        name="number"
                        value={formatCardNumber(cardDetails.number)}
                        onChange={handleInputChange}
                        placeholder="1234 5678 9012 3456"
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <CreditCard />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                    
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Cardholder Name"
                        name="name"
                        value={cardDetails.name}
                        onChange={handleInputChange}
                        placeholder="John Doe"
                      />
                    </Grid>
                    
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        label="Expiry Date"
                        name="expiry"
                        value={cardDetails.expiry}
                        onChange={handleInputChange}
                        placeholder="MM/YY"
                      />
                    </Grid>
                    
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        label="CVV"
                        name="cvv"
                        value={cardDetails.cvv}
                        onChange={handleInputChange}
                        placeholder="123"
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <Badge badgeContent="CVV" color="primary" />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                  </Grid>
                </Paper>
              )}

              <Button
                fullWidth
                variant="contained"
                size="large"
                // onClick={handlePaymentSubmit}
                sx={{
                  py: 2,
                  borderRadius: 2,
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  background: `linear-gradient(45deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: theme.shadows[4]
                  }
                }}
              >
                {/* {paymentMethod === 'upi' ? 'Generate UPI QR Code' : `Pay ₹${totalAmount.toLocaleString()}`} */}
                Please Contact support.team@mrfranchise.in To Buy
              </Button>
            </>
          ) : (
            <>
              {/* UPI QR Code Display
              <Paper elevation={3} sx={{ p: 4, textAlign: 'center', borderRadius: 3, mb: 3 }}>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                  Scan to Pay with Google Pay
                </Typography>
                
                <Box sx={{
                  p: 2,
                  border: `2px dashed ${theme.palette.divider}`,
                  borderRadius: 2,
                  display: 'inline-block',
                  mb: 3
                }}>
                  <QrCode sx={{ fontSize: 200, color: theme.palette.text.primary }} />
                </Box>
                
                <Typography variant="body1" sx={{ mb: 1 }}>
                  Transaction ID: <strong>{upiId}</strong>
                </Typography>
                
                <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
                  ₹{totalAmount.toLocaleString()}
                </Typography>
                
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Open your UPI app and scan this code to complete payment
                </Typography>
                
                <Box sx={{
                  backgroundColor: theme.palette.grey[100],
                  p: 2,
                  borderRadius: 1,
                  display: 'inline-block'
                }}>
                  <Typography variant="body2">
                    <strong>UPI ID:</strong> business.upi@paymentgateway
                  </Typography>
                </Box>
              </Paper>
              
              <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 3 }}>
                Waiting for payment confirmation...
              </Typography> */}
            </>
          )}
        </>
      ) : (
        /* Payment Success Screen */
        <Paper elevation={3} sx={{ p: 4, textAlign: 'center', borderRadius: 3 }}>
          <CheckCircle sx={{ fontSize: 80, color: theme.palette.success.main, mb: 2 }} />
          <Typography variant="h4" sx={{ mb: 2, fontWeight: 700 }}>
            Payment Successful!
          </Typography>
          <Typography variant="body1" sx={{ mb: 3 }}>
            Your payment of ₹{totalAmount.toLocaleString()} has been received.
          </Typography>
          
          <Box sx={{
            backgroundColor: theme.palette.grey[100],
            p: 3,
            borderRadius: 2,
            textAlign: 'left',
            mb: 3
          }}>
            <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600 }}>
              Transaction Details:
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2">Transaction ID:</Typography>
              <Typography variant="body2">{upiId}</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2">Payment Method:</Typography>
              <Typography variant="body2">UPI / Google Pay</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2">Subtotal:</Typography>
              <Typography variant="body2">₹{subtotal.toLocaleString()}</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2">GST (18%):</Typography>
              <Typography variant="body2">₹{gstAmount.toLocaleString()}</Typography>
            </Box>
            <Divider sx={{ my: 1 }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="body1" fontWeight={600}>Total Paid:</Typography>
              <Typography variant="body1" fontWeight={600}>₹{totalAmount.toLocaleString()}</Typography>
            </Box>
          </Box>
          
          <Button
            variant="contained"
            size="large"
            onClick={() => onSubmit({
              membership,
              banners,
              paymentMethod,
              upiId,
              gstAmount,
              totalAmount,
              subtotal
            })}
            sx={{
              px: 6,
              py: 1.5,
              borderRadius: 2,
              fontWeight: 600
            }}
          >
            Continue to Dashboard
          </Button>
        </Paper>
      )}
    </Box>
  );
};

export default PaymentPage;