import React from 'react';
import type { MerchantBrand, CategoryId } from '../types';

interface BrandIconProps {
  brand?: MerchantBrand;
  category?: CategoryId;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const BrandIcon: React.FC<BrandIconProps> = ({
  brand = 'generic',
  category = 'others',
  className = '',
  size = 'md',
}) => {
  const sizeClasses = {
    sm: 'w-6 h-6 text-xs',
    md: 'w-8 h-8 text-sm',
    lg: 'w-10 h-10 text-base',
  };

  const getBrandDetails = () => {
    switch (brand) {
      case 'swiggy':
        return {
          bg: 'bg-[#FC8019] text-white',
          label: 'SW',
          icon: (
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-4/5 h-4/5">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 14.93c-1.85-.24-3.32-1.7-3.56-3.55h7.12c-.24 1.85-1.71 3.31-3.56 3.55zM12 4c2.87 0 5.3 1.84 6.22 4.41H5.78C6.7 5.84 9.13 4 12 4z"/>
            </svg>
          ),
          name: 'Swiggy',
        };
      case 'zomato':
        return {
          bg: 'bg-[#CB202D] text-white font-black',
          label: 'Z',
          icon: <span className="font-heading font-black tracking-tighter text-xs">zomato</span>,
          name: 'Zomato',
        };
      case 'uber':
        return {
          bg: 'bg-black text-white font-bold',
          label: 'Uber',
          icon: <span className="font-sans font-extrabold tracking-tighter text-[10px]">Uber</span>,
          name: 'Uber',
        };
      case 'ola':
        return {
          bg: 'bg-[#A4C639] text-black font-extrabold',
          label: 'Ola',
          icon: <span className="font-heading font-black text-xs">OLA</span>,
          name: 'Ola Cabs',
        };
      case 'metro':
        return {
          bg: 'bg-[#E63B2E] text-white',
          label: 'DMRC',
          icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4/5 h-4/5">
              <rect x="4" y="3" width="16" height="16" rx="2" />
              <path d="M4 11h16M12 3v8M8 19l-2 3M16 19l2 3" />
              <circle cx="8" cy="15" r="1" fill="currentColor" />
              <circle cx="16" cy="15" r="1" fill="currentColor" />
            </svg>
          ),
          name: 'Metro / DMRC',
        };
      case 'spotify':
        return {
          bg: 'bg-[#1DB954] text-black',
          label: 'Spotify',
          icon: (
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-4/5 h-4/5">
              <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm4.586 14.424a.623.623 0 01-.857.207c-2.348-1.435-5.304-1.76-8.785-.964a.624.624 0 11-.277-1.217c3.81-.871 7.077-.498 9.712 1.117.293.18.387.564.207.857zm1.224-2.719a.78.78 0 01-1.073.257c-2.687-1.652-6.785-2.131-9.965-1.166a.781.781 0 01-.453-1.496c3.632-1.102 8.147-.568 11.234 1.332.368.226.483.706.257 1.073zm.105-2.835C14.692 8.97 9.387 8.795 6.309 9.73a.936.936 0 11-.546-1.791c3.535-1.073 9.404-.866 13.123 1.341a.937.937 0 11-.971 1.59z"/>
            </svg>
          ),
          name: 'Spotify',
        };
      case 'youtube':
        return {
          bg: 'bg-[#FF0000] text-white',
          label: 'YouTube',
          icon: (
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-4/5 h-4/5">
              <path d="M21.582 6.186a2.806 2.806 0 00-1.973-1.986C17.868 3.733 12 3.733 12 3.733s-5.868 0-7.609.467a2.806 2.806 0 00-1.973 1.986C2 7.939 2 12 2 12s0 4.061.418 5.814a2.806 2.806 0 001.973 1.986c1.741.467 7.609.467 7.609.467s5.868 0 7.609-.467a2.806 2.806 0 001.973-1.986C22 16.061 22 12 22 12s0-4.061-.418-5.814zM10 15.5v-7l6 3.5-6 3.5z"/>
            </svg>
          ),
          name: 'YouTube',
        };
      case 'netflix':
        return {
          bg: 'bg-black text-[#E50914] font-black',
          label: 'N',
          icon: <span className="font-heading font-black text-sm text-[#E50914]">N</span>,
          name: 'Netflix',
        };
      case 'tapri':
        return {
          bg: 'bg-[#F5B700] text-[#14110F]',
          label: '☕',
          icon: <span className="text-sm">☕</span>,
          name: 'Chai Tapri',
        };
      case 'xerox':
        return {
          bg: 'bg-[#E6D9C0] text-[#14110F]',
          label: '📄',
          icon: <span className="text-sm">📄</span>,
          name: 'Xerox / Print',
        };
      case 'blinkit':
      case 'zepto':
        return {
          bg: 'bg-[#FEE135] text-black font-extrabold',
          label: '⚡',
          icon: <span className="text-xs font-heading font-bold">10m</span>,
          name: 'Quick Grocery',
        };
      case 'amazon':
        return {
          bg: 'bg-[#232F3E] text-[#FF9900] font-bold',
          label: 'a',
          icon: <span className="font-heading font-black text-xs text-[#FF9900]">a</span>,
          name: 'Amazon',
        };
      case 'mess':
        return {
          bg: 'bg-[#1F7A4D] text-white',
          label: '🍲',
          icon: <span className="text-sm">🍲</span>,
          name: 'Hostel Mess',
        };
      default:
        // Fallback to category icon
        switch (category) {
          case 'food':
            return { bg: 'bg-[#FAF4E9] text-[#14110F]', label: '🍔', icon: '🍔', name: 'Food' };
          case 'transport':
            return { bg: 'bg-[#FAF4E9] text-[#14110F]', label: '🚕', icon: '🚕', name: 'Transport' };
          case 'academics':
            return { bg: 'bg-[#FAF4E9] text-[#14110F]', label: '📚', icon: '📚', name: 'Academics' };
          case 'subscriptions':
            return { bg: 'bg-[#FAF4E9] text-[#14110F]', label: '🔄', icon: '🔄', name: 'Subscriptions' };
          case 'outing':
            return { bg: 'bg-[#FAF4E9] text-[#14110F]', label: '🎉', icon: '🎉', name: 'Outing' };
          case 'personal':
            return { bg: 'bg-[#FAF4E9] text-[#14110F]', label: '🛍️', icon: '🛍️', name: 'Personal' };
          default:
            return { bg: 'bg-[#FAF4E9] text-[#14110F]', label: '₹', icon: '₹', name: 'General' };
        }
    }
  };

  const details = getBrandDetails();

  return (
    <div
      title={details.name}
      className={`inline-flex items-center justify-center border-2 border-[#14110F] shadow-[1.5px_1.5px_0px_#14110F] shrink-0 font-mono select-none ${sizeClasses[size]} ${details.bg} ${className}`}
    >
      {details.icon}
    </div>
  );
};
