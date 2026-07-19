'use client';

import { useEffect, useState } from 'react';

const AnimationLottie = ({ animationPath, width = "95%" }) => {
  const [Lottie, setLottie] = useState(null);

  useEffect(() => {
    // Dynamic import: Only runs client-side, skips server prerender
    import('lottie-react').then((module) => {
      setLottie(() => module.default);
    }).catch((error) => {
      console.error('Lottie load failed:', error);
    });
  }, []);

  if (!animationPath) {
    console.warn("Animation path is missing!");
    return null; // or <div>Placeholder</div>
  }

  if (!Lottie) {
    return <div style={{ width, height: '200px' }}>Loading animation...</div>; // Optional placeholder
  }

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationPath,
    style: { width },
  };

  return <Lottie {...defaultOptions} />;
};

export default AnimationLottie;