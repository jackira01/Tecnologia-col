'use client';

import { Badge } from '@tremor/react';
import { Tooltip } from 'flowbite-react';

const MatchIndicator = ({ matchCount, onClick }) => {
  if (!matchCount || matchCount === 0) {
    return null;
  }

  return (
    <Tooltip content={`${matchCount} producto${matchCount > 1 ? 's' : ''} coincide${matchCount > 1 ? 'n' : ''}`}>
      <button
        type="button"
        onClick={onClick}
        className="cursor-pointer transition-transform hover:scale-110"
      >
        <Badge color="orange" size="sm">
          🔥 {matchCount}
        </Badge>
      </button>
    </Tooltip>
  );
};

export default MatchIndicator;
