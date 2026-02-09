'use client';

import { Badge } from '@tremor/react';

const STATUS_CONFIG = {
  esperando: {
    label: 'Esperando',
    color: 'amber',
  },
  contactado: {
    label: 'Contactado',
    color: 'blue',
  },
  vendido: {
    label: 'Vendido',
    color: 'green',
  },
  descartado: {
    label: 'Descartado',
    color: 'red',
  },
};

const StatusBadge = ({ status }) => {
  const config = STATUS_CONFIG[status] || {
    label: status,
    color: 'gray',
  };

  return (
    <Badge color={config.color} size="sm">
      {config.label}
    </Badge>
  );
};

export default StatusBadge;
