'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV_ITEMS = [
  { label: 'Dashboard',     href: '/seller/dashboard'      },
  { label: 'Products',      href: '/seller/products'       },
  { label: 'Orders',        href: '/seller/orders'         },
  { label: 'LKRIDI',        href: '/seller/lkridi'         },
  { label: 'LKRIDI Records',href: '/seller/lkridi/records' },
  { label: 'Workers',       href: '/seller/workers'        },
  { label: 'Promotions',    href: '/seller/promotions'     },
  { label: 'Stores',        href: '/seller/stores'         },
  { label: 'QR Scan',       href: '/seller/qr-scan'        },
];

function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-52 shrink-0 bg-white border-r border-gray-200 min-h-screen p-4">
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-4 px-2">
        Seller Panel
      </p>
      <nav className="space-y-1">
        {NAV_ITEMS.map(({ label, href }) => {
          const active = pathname === href || pathname.startsWith(href + '/');
          return (
            <Link
              key={href}
              href={href}
              className={`block px-3 py-2 rounded text-sm font-medium transition-colors ${
                active
                  ? 'text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
              style={active ? { backgroundColor: '#0F4C81' } : {}}
            >
              {label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

export default function SellerLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}