import React from 'react';
import { Milk, Apple, Carrot, Beef, Croissant, Coffee, Cookie, Snowflake, Package, Soup, ShoppingBag } from 'lucide-react';

const categoryConfig = {
  dairy: { icon: Milk, color: 'bg-blue-100 text-blue-600' },
  fruits: { icon: Apple, color: 'bg-red-100 text-red-600' },
  vegetables: { icon: Carrot, color: 'bg-green-100 text-green-600' },
  meat: { icon: Beef, color: 'bg-pink-100 text-pink-600' },
  bakery: { icon: Croissant, color: 'bg-amber-100 text-amber-600' },
  beverages: { icon: Coffee, color: 'bg-purple-100 text-purple-600' },
  snacks: { icon: Cookie, color: 'bg-orange-100 text-orange-600' },
  frozen: { icon: Snowflake, color: 'bg-cyan-100 text-cyan-600' },
  canned: { icon: Package, color: 'bg-gray-100 text-gray-600' },
  spices: { icon: Soup, color: 'bg-yellow-100 text-yellow-600' },
  other: { icon: ShoppingBag, color: 'bg-slate-100 text-slate-600' }
};

export default function CategoryIcon({ category, size = "md" }) {
  const config = categoryConfig[category] || categoryConfig.other;
  const Icon = config.icon;
  
  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-12 w-12"
  };
  
  const iconSizes = {
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-6 w-6"
  };

  return (
    <div className={`${sizeClasses[size]} ${config.color} rounded-xl flex items-center justify-center transition-all`}>
      <Icon className={iconSizes[size]} />
    </div>
  );
}