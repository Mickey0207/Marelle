import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

const Portal = ({ children, containerId = 'portal-root' }) => {
  const [container, setContainer] = useState(null);

  useEffect(() => {
    // 尋找現有容器或創建新容器
    let portalContainer = document.getElementById(containerId);
    
    if (!portalContainer) {
      portalContainer = document.createElement('div');
      portalContainer.id = containerId;
      portalContainer.style.position = 'absolute';
      portalContainer.style.top = '0';
      portalContainer.style.left = '0';
      portalContainer.style.zIndex = '999999';
      document.body.appendChild(portalContainer);
    }
    
    setContainer(portalContainer);

    // 清理函數
    return () => {
      if (portalContainer && portalContainer.children.length === 0) {
        document.body.removeChild(portalContainer);
      }
    };
  }, [containerId]);

  if (!container) return null;

  return createPortal(children, container);
};

export default Portal;