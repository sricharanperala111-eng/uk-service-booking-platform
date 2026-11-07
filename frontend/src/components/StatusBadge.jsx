import React from 'react';
import { CheckCircle2, Clock, AlertCircle, CheckCircle, XCircle } from 'lucide-react';

export const StatusBadge = ({ status }) => {
  const getIcon = () => {
    switch (status) {
      case 'CONFIRMED':
        return <CheckCircle2 size={13} />;
      case 'PENDING':
        return <Clock size={13} />;
      case 'IN_PROGRESS':
        return <AlertCircle size={13} />;
      case 'COMPLETED':
        return <CheckCircle size={13} />;
      case 'CANCELLED':
        return <XCircle size={13} />;
      default:
        return null;
    }
  };

  const formattedStatus = status ? status.replace('_', ' ') : '';

  return (
    <span className={`status-badge status-${status}`}>
      {getIcon()}
      {formattedStatus}
    </span>
  );
};
