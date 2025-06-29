// src/components/CountdownTimer.jsx
import React, { useState, useEffect } from 'react';
import { Typography, Box, LinearProgress } from '@mui/material';

const CountdownTimer = ({ targetDate, title, compact = false }) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    total: 0
  });
  
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = new Date(targetDate) - new Date();
      const totalDuration = new Date(targetDate) - new Date(new Date(targetDate).getTime() - 30 * 24 * 60 * 60 * 1000); // Assume 30 days total
      
      // Calculate progress (inverted, so it goes down as time passes)
      const calculatedProgress = Math.max(0, Math.min(100, (difference / totalDuration) * 100));
      setProgress(calculatedProgress);
      
      if (difference > 0) {
        return {
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
          total: difference
        };
      } else {
        return {
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          total: 0
        };
      }
    };

    // Initial calculation
    setTimeLeft(calculateTimeLeft());
    
    // Update every second
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    
    return () => clearInterval(timer);
  }, [targetDate]);

  if (compact) {
    // Compact version for plan cards
    return (
      <Box>
        <Box display="flex" justifyContent="space-between" mb={1}>
          <Typography variant="body2">
            {timeLeft.total > 0 ? (
              <>
                {timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s
              </>
            ) : (
              "Completed!"
            )}
          </Typography>
        </Box>
        <LinearProgress 
          variant="determinate" 
          value={progress} 
          color={progress < 20 ? "error" : progress < 50 ? "warning" : "primary"}
          sx={{ height: 6, borderRadius: 3 }}
        />
      </Box>
    );
  }

  // Full version for plan details
  return (
    <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'background.paper', borderRadius: 1, border: '1px solid rgba(0, 0, 0, 0.12)' }}>
      {title && (
        <Typography variant="h6" gutterBottom>
          {title}
        </Typography>
      )}
      
      {timeLeft.total > 0 ? (
        <Box display="flex" justifyContent="center" sx={{ mb: 2 }}>
          <Box sx={{ textAlign: 'center', px: 2 }}>
            <Typography variant="h4">{timeLeft.days}</Typography>
            <Typography variant="body2" color="textSecondary">Days</Typography>
          </Box>
          <Box sx={{ textAlign: 'center', px: 2 }}>
            <Typography variant="h4">{timeLeft.hours}</Typography>
            <Typography variant="body2" color="textSecondary">Hours</Typography>
          </Box>
          <Box sx={{ textAlign: 'center', px: 2 }}>
            <Typography variant="h4">{timeLeft.minutes}</Typography>
            <Typography variant="body2" color="textSecondary">Minutes</Typography>
          </Box>
          <Box sx={{ textAlign: 'center', px: 2 }}>
            <Typography variant="h4">{timeLeft.seconds}</Typography>
            <Typography variant="body2" color="textSecondary">Seconds</Typography>
          </Box>
        </Box>
      ) : (
        <Typography variant="h5" color="success.main" sx={{ my: 2 }}>
          Plan Completed!
        </Typography>
      )}
      
      <LinearProgress 
        variant="determinate" 
        value={progress} 
        color={progress < 20 ? "error" : progress < 50 ? "warning" : "primary"}
        sx={{ height: 10, borderRadius: 5 }}
      />
    </Box>
  );
};

export default CountdownTimer;