import { useEffect, useState } from "react";

const useWindow = (size: number) => {
  const [windowSize, setWindowSize] = useState(size || 768);
  useEffect(() => {
    function viewport() {
      const width = Math.max(
        document.documentElement.clientWidth,
        window.innerWidth || 0,
      );
      setWindowSize(width);
    }
    viewport();
    window.onresize = viewport;
  }, []);

  return windowSize;
};

export default useWindow;
