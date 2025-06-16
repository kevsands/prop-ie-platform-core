import React from 'react';
import { IconType } from 'react-icons';
import { cn } from '@/lib/utils';

interface FeatherIconProps {
  icon: IconType;
  className?: string;
  size?: number;
}

export const FeatherIcon: React.FC<FeatherIconProps> = ({ 
  icon: Icon, 
  className,
  size = 24
}) => {
  return <Icon className={cn('inline-block', className)} size={size} />;
};

export default FeatherIcon; 