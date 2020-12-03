import React, { FC } from 'react'

/**
 * Helper component for disable propagation native keyboard events
 */
export const NoPropagation: FC = ({ children }) => (
  <div
    onKeyDown={(e) => e.stopPropagation()}
    onKeyUp={(e) => e.stopPropagation()}
  >
    {children}
  </div>
)
