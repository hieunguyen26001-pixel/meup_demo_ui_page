import { useEffect } from 'react';

interface LazyCSSLoaderProps {
  href: string;
  id: string;
}

const LazyCSSLoader: React.FC<LazyCSSLoaderProps> = ({ href, id }) => {
  useEffect(() => {
    // Check if CSS is already loaded
    if (document.getElementById(id)) {
      return;
    }

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    link.id = id;
    document.head.appendChild(link);

    return () => {
      // Cleanup on unmount
      const existingLink = document.getElementById(id);
      if (existingLink) {
        existingLink.remove();
      }
    };
  }, [href, id]);

  return null;
};

export default LazyCSSLoader;
