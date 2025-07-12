import React, { useState } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';


const CaptchaOnly = () => {
  const [captchaValue, setCaptchaValue] = useState(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null); // 'success', 'error'

  const handleVerify = async () => {
    if (!captchaValue) {
      setStatus('error');
      return;
    }

    setLoading(true);
    setStatus(null);

    try {
      const response = await fetch('https://franchise-backend-wgp6.onrender.com/api/v1/verify-captcha', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: captchaValue }),
      });

      const data = await response.json();

      if (data.success) {
        setStatus('success');
      } else {
        setStatus('error');
      }
    } catch (err) {
      console.error('Verification failed:', err);
      setStatus('error');
    } finally {
      setLoading(false);
    }
  };

  return (
     
      

       <ReCAPTCHA
        sitekey="6LcGO2orAAAAABdB_akGeQApxKmRjEftNknXZS9N"
        onChange={(value) => setCaptchaValue(value)}
        style={{ marginBottom: '20px' }}
      /> 

     
  );
};

export default CaptchaOnly;
