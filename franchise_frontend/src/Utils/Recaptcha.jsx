import React, { useRef } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';

const CaptchaForm = () => {
  const recaptchaRef = useRef();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = await recaptchaRef.current.executeAsync();
    recaptchaRef.current.reset();

    const response = await fetch('http://localhost:5000/api/v1/verify-captcha', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token }),
    });

    const data = await response.json();

    if (data.success) {
      alert('CAPTCHA verified ✅');
    } else {
      alert('CAPTCHA failed ❌');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" placeholder="Name" required />
      <ReCAPTCHA
        ref={recaptchaRef}
        sitekey={process.env.REACT_APP_RECAPTCHA_SITE_KEY} // or your actual site key directly
        size="invisible"
      />
      <button type="submit">Submit</button>
    </form>
  );
};

export default CaptchaForm;
