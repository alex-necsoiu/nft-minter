// filepath: /Users/alexnecsoiu/repos/linum/nft-minter/src/features/notification/use-notification.ts
import { useState, useEffect } from 'react';

// Custom hook for managing notifications in the application
const useNotification = () => {
  // State to hold the notification message and its visibility
  const [notification, setNotification] = useState<{ message: string; visible: boolean }>({
    message: '',
    visible: false,
  });

  // Function to show a notification
  const showNotification = (message: string) => {
    setNotification({ message, visible: true });
  };

  // Function to hide the notification
  const hideNotification = () => {
    setNotification({ message: '', visible: false });
  };

  // Automatically hide the notification after a specified duration
  useEffect(() => {
    if (notification.visible) {
      const timer = setTimeout(() => {
        hideNotification();
      }, 3000); // Notification will disappear after 3 seconds

      return () => clearTimeout(timer); // Cleanup timer on unmount
    }
  }, [notification.visible]);

  return { notification, showNotification, hideNotification };
};

export default useNotification;