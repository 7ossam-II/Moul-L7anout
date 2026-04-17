'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function BottomTabBar() {
  const pathname = usePathname();

  const tabs = [
    { label: 'Home', href: '/buyer/discover', icon: '🏠' },
    { label: 'Map', href: '/buyer/map', icon: '🗺️' },
    { label: 'Posts', href: '/buyer/posts', icon: '📰' },
    { label: 'Inbox', href: '/buyer/inbox', icon: '💬' },
    { label: 'Account', href: '/buyer/profile', icon: '👤' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around items-center h-20 z-50">
      {tabs.map((tab) => {
        const isActive = pathname === tab.href || pathname.startsWith(tab.href);
        return (
          <Link key={tab.href} href={tab.href}>
            <div
              className={`flex flex-col items-center justify-center h-20 w-full transition ${
                isActive ? 'text-blue-600' : 'text-gray-600'
              }`}
            >
              <span className="text-2xl">{tab.icon}</span>
              <span className="text-xs mt-1">{tab.label}</span>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
