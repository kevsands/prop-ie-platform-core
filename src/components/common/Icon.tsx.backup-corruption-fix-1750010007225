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
  return <Icon {...props} />\n  );
};

// Type-safe icon components
export const IconMapPin = (props: IconProps) => <IconWrapper icon={FiMapPin} {...props} />\n  );
export const IconHome = (props: IconProps) => <IconWrapper icon={FiHome} {...props} />\n  );
export const IconDroplet = (props: IconProps) => <IconWrapper icon={FiDroplet} {...props} />\n  );
export const IconMaximize2 = (props: IconProps) => <IconWrapper icon={FiMaximize2} {...props} />\n  );
export const IconTag = (props: IconProps) => <IconWrapper icon={FiTag} {...props} />\n  );
export const IconMapMarker = (props: IconProps) => <IconWrapper icon={FaMapMarkerAlt} {...props} />\n  );
export const IconEuro = (props: IconProps) => <IconWrapper icon={FaEuroSign} {...props} />\n  );
export const IconBed = (props: IconProps) => <IconWrapper icon={FaBed} {...props} />\n  );
export const IconBath = (props: IconProps) => <IconWrapper icon={FaBath} {...props} />\n  );
export const IconRuler = (props: IconProps) => <IconWrapper icon={FaRulerCombined} {...props} />\n  );