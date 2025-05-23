"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FiHome, FiLayers, FiUsers, FiFileText, FiTool, FiBarChart2, FiSettings, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { FeatherIcon } from '@/components/ui/feather-icon';

interface SidebarProps {
  orgSlug: string;
  projectSlug?: string;
}

interface SidebarItemProps {
  href: string;
  icon: React.ReactNode;
  title: string;
  isActive: boolean;
  hasSubMenu?: boolean;
  isOpen?: boolean;
  onClick?: () => void;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ 
  href, 
  icon, 
  title, 
  isActive, 
  hasSubMenu = false, 
  isOpen = false,
  onClick
}) => {
  return (
    <Link 
      href={href}
      className={`flex items-center px-4 py-3 text-sm font-medium rounded-md mb-1 ${
        isActive 
          ? 'bg-[#2B5273] text-white' 
          : 'text-gray-700 hover:bg-gray-100'
      }`}
      onClick={onClick}
    >
      <div className="mr-3">
        {icon}
      </div>
      <span>{title}</span>
      {hasSubMenu && (
        <div className="ml-auto">
          {isOpen ? <FiChevronDown /> : <FiChevronRight />}
        </div>
      )}
    </Link>
  );
};

const Sidebar: React.FC<SidebarProps> = ({ orgSlug, projectSlug }) => {
  const pathname = usePathname();
  const [isOpensetIsOpen] = useState(true);

  const navigation = [
    {
      name: 'Dashboard',
      href: `/${orgSlug}/dashboard`,
      icon: FiHome},
    {
      name: 'Projects',
      href: `/${orgSlug}/projects`,
      icon: FiLayers},
    {
      name: 'Users',
      href: `/${orgSlug}/users`,
      icon: FiUsers},
    {
      name: 'Documents',
      href: `/${orgSlug}/documents`,
      icon: FiFileText},
    {
      name: 'Tools',
      href: `/${orgSlug}/tools`,
      icon: FiTool},
    {
      name: 'Analytics',
      href: `/${orgSlug}/analytics`,
      icon: FiBarChart2},
    {
      name: 'Settings',
      href: `/${orgSlug}/settings`,
      icon: FiSettings}];

  return (
    <div className={`bg-white border-r border-gray-200 ${isOpen ? 'w-64' : 'w-20'} transition-all duration-300`}>
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between p-4">
          {isOpen && <span className="text-lg font-semibold">Menu</span>}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 rounded-md hover:bg-gray-100"
          >
            <FeatherIcon 
              icon={isOpen ? FiChevronLeft : FiChevronRight} 
              className="h-5 w-5" 
            />
          </button>
        </div>

        <nav className="flex-1 px-2 py-4 space-y-1">
          {navigation.map((item: any) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                  isActive
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <FeatherIcon icon={item.icon} className="h-5 w-5" />
                {isOpen && <span className="ml-3">{item.name}</span>}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;