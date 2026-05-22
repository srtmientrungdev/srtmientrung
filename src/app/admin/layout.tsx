'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { RiHome4Line, RiLogoutBoxRLine, RiArrowDownSLine } from 'react-icons/ri';
import { logout } from '@/app/auth/actions';

const NAV = [
  { href: '/admin', label: 'Danh sách căn hộ', icon: RiHome4Line },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex h-screen overflow-hidden bg-gray-100">
      {/* Sidebar */}
      <aside className="flex w-60 shrink-0 flex-col border-r border-gray-100 bg-white">
        {/* Logo */}
        <Link href="/" className="flex justify-center border-b border-gray-100 py-4">
          <Image src="/logo.png" alt="SRT Miền Trung" width={150} height={80} />
        </Link>

        {/* Nav */}
        <nav className="flex flex-1 flex-col gap-1 px-3 pt-4">
          {NAV.map(({ href, label, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${active
                  ? 'bg-red-50 text-red-700'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
              >
                <Icon className="text-base" />
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="space-y-1 border-t border-gray-100 px-3 py-3">
          <form action={logout}>
            <button type="submit" className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-gray-600 transition-colors hover:bg-gray-50 hover:text-gray-900">
              <RiLogoutBoxRLine className="text-base" />
              Đăng xuất
            </button>
          </form>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}
