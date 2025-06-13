import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Box, keyframes, styled } from '@mui/material';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

// Premium Animations
const spin = keyframes`
  0% { transform: rotateX(0) rotateY(0); }
  50% { transform: rotateX(180deg) rotateY(360deg); }
  100% { transform: rotateX(360deg) rotateY(720deg); }
`;

const floatParticles = keyframes`
  0% { transform: translateY(0) translateX(0) scale(0.5); opacity: 0; }
  20% { opacity: 1; transform: scale(1); }
  80% { opacity: 1; }
  100% { transform: translateY(-150px) translateX(${Math.random() * 60 - 30}px) scale(0.5); opacity: 0; }
`;

const fadeIn = keyframes`
  0% { opacity: 0; transform: translateY(10px); }
  100% { opacity: 1; transform: translateY(0); }
`;

const progressPulse = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(101, 227, 177, 0.7); }
  70% { box-shadow: 0 0 0 15px rgba(200, 250, 230, 0); }
  100% { box-shadow: 0 0 0 0 rgba(101, 227, 177, 0); }
`;

// Premium Styled Components
const PremiumLoader = styled('div')(({ theme }) => ({
  position: 'relative',
  width: '350px',
  height: '400px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  perspective: '1200px',
  overflow: 'hidden',

  '& .cube-container': {
    width: '150px',
    height: '150px',
    position: 'relative',
    transformStyle: 'preserve-3d',
    animation: `${spin} 6s infinite cubic-bezier(0.68, -0.55, 0.27, 1.55)`,
    marginBottom: '50px',
    filter: 'drop-shadow(0 0 20px rgba(101, 227, 177, 0.5))',
  },

  '& .cube-face': {
    position: 'absolute',
    width: '100%',
    height: '100%',
    border: `3px solid`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '24px',
    fontWeight: 'bold',
    color: theme.palette.common.white,
    backdropFilter: 'blur(8px)',
    boxShadow: 'inset 0 0 30px rgba(255, 255, 255, 0.2)',
    textShadow: '0 0 10px rgba(255, 255, 255, 0.5)',
  },

  '& .cube-face-front': {
    transform: 'translateZ(75px)',
    borderColor: '#65E3B1',
    background: 'linear-gradient(135deg, rgba(101, 227, 177, 0.3) 0%, rgba(101, 227, 177, 0.1) 100%)',
  },
  '& .cube-face-back': {
    transform: 'rotateY(180deg) translateZ(75px)',
    borderColor: '#FF7DAA',
    background: 'linear-gradient(135deg, rgba(255, 125, 170, 0.3) 0%, rgba(255, 125, 170, 0.1) 100%)',
  },
  '& .cube-face-right': {
    transform: 'rotateY(90deg) translateZ(75px)',
    borderColor: '#7D8AFF',
    background: 'linear-gradient(135deg, rgba(125, 138, 255, 0.3) 0%, rgba(125, 138, 255, 0.1) 100%)',
  },
  '& .cube-face-left': {
    transform: 'rotateY(-90deg) translateZ(75px)',
    borderColor: '#FFC77D',
    background: 'linear-gradient(135deg, rgba(255, 199, 125, 0.3) 0%, rgba(255, 199, 125, 0.1) 100%)',
  },
  '& .cube-face-top': {
    transform: 'rotateX(90deg) translateZ(75px)',
    borderColor: '#C77DFF',
    background: 'linear-gradient(135deg, rgba(199, 125, 255, 0.3) 0%, rgba(199, 125, 255, 0.1) 100%)',
  },
  '& .cube-face-bottom': {
    transform: 'rotateX(-90deg) translateZ(75px)',
    borderColor: '#7DFFFF',
    background: 'linear-gradient(135deg, rgba(125, 255, 255, 0.3) 0%, rgba(125, 255, 255, 0.1) 100%)',
  },

  '& .particles': {
    position: 'absolute',
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, #65E3B1, #7D8AFF)',
    animation: `${floatParticles} 4s infinite ease-in-out`,
    opacity: 0,
    filter: 'blur(1px)',
  },

  '& .loading-text': {
    marginTop: '30px',
    fontSize: '22px',
    fontWeight: 'bold',
    color: theme.palette.common.white,
    textTransform: 'uppercase',
    letterSpacing: '2px',
    animation: `${fadeIn} 1s ease-in-out`,
    background: 'linear-gradient(90deg, #65E3B1, #7D8AFF)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },

  '& .progress-container': {
    width: '250px',
    marginTop: '25px',
    position: 'relative',
  },

  '& .progress-bar': {
    height: '6px',
    borderRadius: '3px',
    background: 'rgba(255, 255, 255, 0.2)',
    overflow: 'hidden',
  },

  '& .progress-fill': {
    height: '100%',
    borderRadius: '3px',
    background: 'linear-gradient(90deg, #65E3B1, #7D8AFF)',
    transition: 'width 0.3s ease-out',
    position: 'relative',
    '&:after': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      borderRadius: '3px',
      animation: `${progressPulse} 2s infinite`,
    }
  },

  '& .progress-text': {
    position: 'absolute',
    right: 0,
    top: '-25px',
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#65E3B1',
    fontFamily: 'monospace',
  },

  '& .glow-effect': {
    position: 'absolute',
    width: '300px',
    height: '300px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(101, 227, 177, 0.2) 0%, rgba(101, 227, 177, 0) 70%)',
    filter: 'blur(10px)',
    zIndex: -1,
  }
}));

// Generate random particles with different shapes
const generateParticles = (count) => {
  const shapes = ['circle', 'square', 'triangle'];
  return Array.from({ length: count }).map((_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    bottom: `${Math.random() * 20}%`,
    size: `${Math.random() * 6 + 4}px`,
    delay: `${Math.random() * 3}s`,
    duration: `${Math.random() * 3 + 3}s`,
    shape: shapes[Math.floor(Math.random() * shapes.length)],
    color: `hsl(${Math.random() * 60 + 160}, 80%, 70%)`,
  }));
};

const GlobalLoader = () => {
  const isLoading = useSelector((state) => state.loading.isLoading);
  const [progress, setProgress] = useState(0);
  const particles = generateParticles(25);

  useEffect(() => {
    if (isLoading) {
      NProgress.start();
      
      // Simulate progress with variable speed
      const interval = setInterval(() => {
        setProgress((prev) => {
          const increment = prev < 30 ? Math.random() * 8 : 
                          prev < 70 ? Math.random() * 4 : 
                          Math.random() * 2;
          const newProgress = prev + increment;
          return newProgress >= 100 ? 100 : newProgress;
        });
      }, 300);

      return () => clearInterval(interval);
    } else {
      NProgress.done();
      setProgress(0);
    }
  }, [isLoading]);

  if (!isLoading) return null;

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        background: 'linear-gradient(135deg,rgb(255, 255, 255),rgb(243, 248, 255))',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1300,
      }}
    >
      <PremiumLoader>
        {/* Glow effect */}
        <div className="glow-effect" />
        
        {/* 3D Cube */}
        <div className="cube-container">
          <div className="cube-face cube-face-front">FRANCHISE</div>
          <div className="cube-face cube-face-back">PREMIUM</div>
          <div className="cube-face cube-face-right">INVEST</div>
          <div className="cube-face cube-face-left">GROW</div>
          <div className="cube-face cube-face-top">SUCCESS</div>
          <div className="cube-face cube-face-bottom">2024</div>
        </div>

        {/* Floating Particles */}
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="particles"
            style={{
              left: particle.left,
              bottom: particle.bottom,
              width: particle.size,
              height: particle.size,
              animationDelay: particle.delay,
              animationDuration: particle.duration,
              background: particle.color,
              borderRadius: particle.shape === 'circle' ? '50%' : 
                         particle.shape === 'triangle' ? '50% 50% 0' : '3px',
              transform: particle.shape === 'triangle' ? 'rotate(45deg)' : 'none',
            }}
          />
        ))}

        <div className="loading-text">Building Your Franchise Future</div>
        
        <div className="progress-container">
          <div className="progress-text">{Math.round(progress)}%</div>
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </PremiumLoader>
    </Box>
  );
};

export default GlobalLoader;


// import React from 'react';
// import { Box } from '@mui/material';

// function GlobalLoader() {
//   return (
//     <Box
//       sx={{
//         width: '100vw',
//         height: '100vh',
//         bgcolor: 'background.default',
//         display: 'flex',
//         justifyContent: 'center',
//         alignItems: 'center',
//         flexDirection: 'column',
//         position: 'fixed',
//         top: 0,
//         left: 0,
//         zIndex: 9999,
//       }}
//     >
//       <Box
//         sx={{
//           position: 'relative',
//           width: { xs: '80%', sm: '60%', md: '300px' },
//           height: { xs: '80%', sm: '60%', md: '300px' },
//           maxWidth: '300px',
//           maxHeight: '300px',
//         }}
//       >
//         {/* Animated background circle */}
//         <Box
//           sx={{
//             position: 'absolute',
//             width: '100%',
//             height: '100%',
//             borderRadius: '50%',
//             background: 'linear-gradient(45deg, #ff9800 0%, #ffc107 100%)',
//             animation: 'pulse 2s infinite alternate',
//             opacity: 0.2,
//           }}
//         />
        
//         {/* Main animated logo */}
//         <svg
//           xmlns="http://www.w3.org/2000/svg"
//           viewBox="0 0 120 120"
//           style={{
//             width: '100%',
//             height: '100%',
//             position: 'relative',
//             zIndex: 2,
//             filter: 'drop-shadow(0 0 8px rgba(255, 152, 0, 0.5))',
//           }}
//         >
//           <defs>
//             <clipPath id="circle-clip">
//               <path
//                 d="M101.807,123.37c10-0.352,18.193,5.401,18.193,5.401V0H0v128.771c0,0,9.701-5.227,17.069-5.227s10.464,6.314,20.877,6.314
//                 c10.175,0,12.703-4.209,22.053-4.209s11.981,5.438,20.578,5.438S91.807,123.722,101.807,123.37z"
//               >
//                 <animate
//                   id="morph-one"
//                   dur="4s"
//                   begin="0"
//                   repeatCount="indefinite"
//                   attributeName="d"
//                   values="
//                   M101.807,123.37c10-0.352,18.193,5.401,18.193,5.401V0H0v128.771c0,0,9.701-5.227,17.069-5.227s10.464,6.314,20.877,6.314
//                   c10.175,0,12.703-4.209,22.053-4.209s11.981,5.438,20.578,5.438S91.807,123.722,101.807,123.37z;

//                   M101.807,135.303c10-0.352,18.193-6.531,18.193-6.531V0H0v128.771c0,0,9.701,4.952,17.069,4.952s10.464-9.299,20.877-9.299
//                   c10.175,0,12.703,9.299,22.053,9.299s11.981-9.123,20.578-9.123S91.807,135.654,101.807,135.303z;

//                   M101.807,123.37c10-0.352,18.193,5.401,18.193,5.401V0H0v128.771c0,0,9.701-5.227,17.069-5.227s10.464,6.314,20.877,6.314
//                   c10.175,0,12.703-4.209,22.053-4.209s11.981,5.438,20.578,5.438S91.807,123.722,101.807,123.37z"
//                 />
//               </path>
//             </clipPath>
//           </defs>

//           <g clipPath="url(#circle-clip)">
//             <path
//               d="M84.995 62.896h-5.788v3.061h5.788c1.037 0 1.68-0.611 1.68-1.512C86.675 63.582 86.032 62.896 84.995 62.896zM86.211 55.411c0-0.828-0.68-1.368-1.43-1.368h-5.574v2.808h5.574C85.531 56.85 86.211 56.274 86.211 55.411zM60 0C26.863 0 0 26.863 0 60c0 33.138 26.863 60 60 60 33.138 0 60-26.862 60-60C120 26.863 93.138 0 60 0zM48.974 72.004h-7.217v-9.178h-8.54v9.178H26V47.996h7.217v8.495h8.54v-8.495h7.217V72.004zM69.094 72.004H52.836V47.996h7.218v17.672h9.04V72.004zM86.962 72.004H71.99V47.996h14.471c4.931 0 7.075 3.312 7.075 6.119 0 2.987-1.752 5.003-4.074 5.507C92.035 60.018 94 62.393 94 65.488 94 68.836 91.749 72.004 86.962 72.004z"
//               fill="#ff9800"
//             />
//           </g>
//         </svg>

//         {/* Floating dots */}
//         {[...Array(5)].map((_, i) => (
//           <Box
//             key={i}
//             sx={{
//               position: 'absolute',
//               width: 8,
//               height: 8,
//               borderRadius: '50%',
//               backgroundColor: '#ff9800',
//               opacity: 0.6,
//               animation: `float 3s infinite ${i * 0.5}s`,
//               top: `${Math.random() * 80 + 10}%`,
//               left: `${Math.random() * 80 + 10}%`,
//             }}
//           />
//         ))}
//       </Box>

//       {/* Loading text with animation */}
//       <Box
//         sx={{
//           mt: 4,
//           color: 'text.primary',
//           fontSize: '1.2rem',
//           fontWeight: 'medium',
//           animation: 'fadeInOut 2s infinite',
//         }}
//       >
//         Loading...
//       </Box>

//       {/* Global styles for animations */}
//       <style jsx global>{`
//         @keyframes pulse {
//           0% { transform: scale(0.95); opacity: 0.2; }
//           100% { transform: scale(1.05); opacity: 0.3; }
//         }
//         @keyframes float {
//           0% { transform: translateY(0) scale(1); opacity: 0.6; }
//           50% { transform: translateY(-20px) scale(1.2); opacity: 0.9; }
//           100% { transform: translateY(0) scale(1); opacity: 0.6; }
//         }
//         @keyframes fadeInOut {
//           0% { opacity: 0.6; }
//           50% { opacity: 1; }
//           100% { opacity: 0.6; }
//         }
//       `}</style>
//     </Box>
//   );
// }

// export default GlobalLoader;