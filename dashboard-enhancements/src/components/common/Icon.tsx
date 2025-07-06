import React from 'react';
import { IconBaseProps } from 'react-icons';
import { FiMapPin, FiHome, FiDroplet, FiMaximize2, FiTag } from 'react-icons/fi';
import { FaMapMarkerAlt, FaEuroSign, FaBed, FaBath, FaRulerCombined } from 'react-icons/fa';

interface IconProps extends IconBaseProps {
  className?: string;
  size?: number;
}

// Type-safe icon wrapper component
const IconWrapper: React.FC<{ icon: React.ComponentType<IconProps> } & IconProps> = ({ icon: Icon, ...props }) => {
  return <Icon {...props} />;
};

// Type-safe icon components
export const IconMapPin = (props: IconProps) => <IconWrapper icon={FiMapPin} {...props} />;
export const IconHome = (props: IconProps) => <IconWrapper icon={FiHome} {...props} />;
export const IconDroplet = (props: IconProps) => <IconWrapper icon={FiDroplet} {...props} />;
export const IconMaximize2 = (props: IconProps) => <IconWrapper icon={FiMaximize2} {...props} />;
export const IconTag = (props: IconProps) => <IconWrapper icon={FiTag} {...props} />;
export const IconMapMarker = (props: IconProps) => <IconWrapper icon={FaMapMarkerAlt} {...props} />;
export const IconEuro = (props: IconProps) => <IconWrapper icon={FaEuroSign} {...props} />;
export const IconBed = (props: IconProps) => <IconWrapper icon={FaBed} {...props} />;
export const IconBath = (props: IconProps) => <IconWrapper icon={FaBath} {...props} />;
export const IconRuler = (props: IconProps) => <IconWrapper icon={FaRulerCombined} {...props} />; 