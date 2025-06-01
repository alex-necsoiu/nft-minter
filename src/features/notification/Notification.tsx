import React from 'react';

interface NotificationProps {
  message: string;
  type: 'success' | 'error';
}

const Notification: React.FC<NotificationProps> = ({ message, type }) => (
  <div
    className={`p-3 rounded mb-2 text-white ${
      type === 'success' ? 'bg-green-600' : 'bg-red-600'
    }`}
    role="alert"
  >
    {message}
  </div>
);

export default Notification;