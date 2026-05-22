'use client';

import Image from 'next/image';
import { Navigation, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

interface ApartmentCardProps {
  src: string;
  index: number;
  total: number;
}

function ApartmentCard({ src, index, total }: ApartmentCardProps) {
  return (
    <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-sm border border-zinc-100 bg-white">
      <Image
        src={src}
        alt={`Hình ${index + 1}`}
        fill
        className="object-contain"
        sizes="(max-width: 1024px) 90vw, 55vw"
        priority={index === 0}
      />

      {/* Counter + logo overlay */}
      <div className="absolute inset-x-0 top-0 flex items-center px-4 pt-3 pointer-events-none">
        <span className="text-xs font-semibold bg-zinc-800/80 text-white rounded-full px-3 py-1 backdrop-blur-sm z-10">
          {index + 1} / {total}
        </span>
        <div className="absolute left-1/2 -translate-x-1/2">
          <Image
            src="/logo.png"
            alt="SRT Mientrung"
            width={120}
            height={28}
            className="h-7 w-auto object-contain"
          />
        </div>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="w-full h-full min-h-[420px] rounded-2xl border border-zinc-100 bg-white flex flex-col items-center justify-center gap-4 px-8 text-center">
      {/* House illustration — pure CSS */}
      <div className="relative w-52 h-44 select-none pointer-events-none opacity-20">
        {/* Clouds */}
        <div className="absolute top-2 left-4 w-12 h-6 bg-zinc-400 rounded-full" />
        <div className="absolute top-0 left-10 w-16 h-8 bg-zinc-400 rounded-full" />
        <div className="absolute top-2 right-4 w-12 h-6 bg-zinc-400 rounded-full" />
        <div className="absolute top-0 right-10 w-16 h-8 bg-zinc-400 rounded-full" />

        {/* House body */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-32 h-18 bg-zinc-300 rounded-sm" style={{ height: '4.5rem' }} />

        {/* Roof */}
        <div
          className="absolute left-1/2 -translate-x-1/2"
          style={{
            bottom: '6.5rem',
            width: 0,
            height: 0,
            borderLeft: '52px solid transparent',
            borderRight: '52px solid transparent',
            borderBottom: '32px solid #d1d5db',
          }}
        />

        {/* Door */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-9 h-11 bg-zinc-400 rounded-t-full" />

        {/* Windows */}
        <div className="absolute bg-zinc-400 rounded-sm w-6 h-6" style={{ bottom: '4rem', left: 'calc(50% - 28px)' }} />
        <div className="absolute bg-zinc-400 rounded-sm w-6 h-6" style={{ bottom: '4rem', left: 'calc(50% + 4px)' }} />

        {/* Trees */}
        <div className="absolute bottom-8 left-3 flex flex-col items-center">
          <div style={{ width: 0, height: 0, borderLeft: '12px solid transparent', borderRight: '12px solid transparent', borderBottom: '22px solid #fca5a5' }} />
          <div className="w-2.5 h-5 bg-zinc-400" />
        </div>
        <div className="absolute bottom-8 right-3 flex flex-col items-center">
          <div style={{ width: 0, height: 0, borderLeft: '12px solid transparent', borderRight: '12px solid transparent', borderBottom: '22px solid #fca5a5' }} />
          <div className="w-2.5 h-5 bg-zinc-400" />
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-base font-semibold text-zinc-700">Không có hình ảnh</p>
        <p className="text-sm text-zinc-400 leading-relaxed max-w-xs">
          Căn hộ này hiện chưa có hình ảnh nào.<br />
          Vui lòng quay lại sau hoặc liên hệ quản trị viên để được hỗ trợ.
        </p>
      </div>
    </div>
  );
}

export default function ApartmentCarousel({ images }: { images?: string[] | null }) {
  if (!images || images.length === 0) {
    return (
      <section className="w-full relative px-6 lg:px-0 lg:h-full lg:flex lg:flex-col">
        <EmptyState />
      </section>
    );
  }

  return (
    <section className="w-full relative px-6 lg:px-0 lg:h-full lg:flex lg:flex-col">
      <Swiper
        modules={[Navigation, Pagination]}
        navigation={{ prevEl: '.apt-prev', nextEl: '.apt-next' }}
        pagination={{ clickable: true }}
        spaceBetween={16}
        slidesPerView={1}
        className="apt-swiper w-full h-full"
        style={{ paddingBottom: '2.5rem' }}
      >
        {images.map((src, i) => (
          <SwiperSlide key={`${src}-${i}`} className="h-full">
            <ApartmentCard src={src} index={i} total={images.length} />
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Prev arrow */}
      <button
        className="apt-prev absolute left-0 lg:-left-5 top-1/2 z-10 -translate-y-1/2 w-9 h-9 flex items-center justify-center bg-white/90 backdrop-blur-sm rounded-full shadow-md border border-zinc-200 text-zinc-600 hover:text-primary hover:border-primary/30 transition-all disabled:opacity-30"
        aria-label="Truoc"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
          <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
        </svg>
      </button>

      {/* Next arrow */}
      <button
        className="apt-next absolute right-0 lg:-right-5 top-1/2 z-10 -translate-y-1/2 w-9 h-9 flex items-center justify-center bg-white/90 backdrop-blur-sm rounded-full shadow-md border border-zinc-200 text-zinc-600 hover:text-primary hover:border-primary/30 transition-all disabled:opacity-30"
        aria-label="Tiep theo"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
          <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
        </svg>
      </button>
    </section>
  );
}
