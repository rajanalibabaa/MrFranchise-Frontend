import { useSelector } from 'react-redux';
import { CircularProgress, Box } from '@mui/material';

const GlobalLoader = () => {
  const isLoading = useSelector((state) => state.loading.isLoading);

  if (!isLoading) return null;

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: 'rgba(255,255,255,0.6)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 9999,
      }}
    >
      <CircularProgress size={60} />
    </Box>
  );
};

export default GlobalLoader;
