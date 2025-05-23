import React from 'react';
import * as Icons from 'react-feather';

type IconName = keyof typeof Icons;
type IconProps = React.ComponentProps<typeof Icons[keyof typeof Icons]>;

interface FeatherIconProps extends IconProps {
  name: IconName;
}

export const FeatherIcon: React.FC<FeatherIconProps> = ({ name, ...props }) => {
  const IconComponent = Icons[name];
  return <IconComponent {...props} />;
};