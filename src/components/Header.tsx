'use client';

import Image from 'next/image';
import { LuBuilding2, } from 'react-icons/lu';

export default function Header() {

  return (
    <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-zinc-100 px-4 md:px-8 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <Image
            src="/logo.png"
            alt="SRT Mientrung Logo"
            width={180}
            height={42}
            className="w-auto h-8 md:h-10 object-contain"
            priority
          />
        </div>

        {/* Right side navigation details */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-zinc-700 bg-zinc-50 px-3 py-1.5 rounded-full border border-zinc-200/50">
            <LuBuilding2 className="w-4 h-4 text-primary" />
            <span className="text-xs md:text-sm font-medium tracking-tight">
              Tra cứu thông tin căn hộ
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
