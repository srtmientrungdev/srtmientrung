'use client';

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { LuCircleAlert, LuCircleCheck, LuInfo, LuRotateCcw, LuSearch } from 'react-icons/lu';

interface SearchFormData {
  apartmentCode: string;
}

interface SearchFormProps {
  defaultCode?: string;
  notFound?: boolean;
  hasResult?: boolean;
}

export default function SearchForm({ defaultCode = '', notFound = false, hasResult = false }: SearchFormProps) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SearchFormData>({ defaultValues: { apartmentCode: defaultCode } });


  const onSubmit = (data: SearchFormData) => {
    const code = data.apartmentCode.trim().toUpperCase();
    if (code) router.push(`/?code=${encodeURIComponent(code)}`);
  };

  return (
    <section className="w-full px-4 lg:px-0">
      {/* Mobile: white card | Desktop: transparent */}
      <h1 className="text-2xl lg:text-5xl font-bold text-zinc-900 mb-1 lg:mb-3 leading-tight">
        Tra cứu thông tin{' '}
        <span className="text-primary">căn hộ</span>
      </h1>
      <p className="text-sm lg:text-base text-zinc-500 mb-5 lg:mb-7">
        Nhập mã căn hộ để xem thông tin chi tiết
      </p>
      <div className="bg-white rounded-2xl shadow-sm border border-zinc-100 p-6">


        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex gap-2 lg:max-w-sm"
        >
          <input
            {...register('apartmentCode', {
              required: 'Vui lòng nhập mã căn hộ',
              pattern: {
                value: /^[A-Z0-9.]+$/i,
                message: 'Mã căn hộ không hợp lệ',
              },
            })}
            placeholder="Nhập mã căn hộ (VD: P1.01.12A)"
            autoComplete="off"
            className="flex-1 h-12 lg:h-14 px-4 rounded-xl border border-zinc-200 lg:border-zinc-300 text-sm lg:text-base text-zinc-800 placeholder:text-zinc-400 bg-white focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
          />
          <button
            type="submit"
            aria-label="Tìm kiếm"
            className="h-12 lg:h-14 w-12 lg:w-14 flex items-center justify-center bg-primary text-white rounded-xl hover:opacity-90 active:scale-95 transition-all shrink-0"
          >
            <LuSearch className="w-5 h-5 lg:w-6 lg:h-6" />
          </button>
          <button
            type="button"
            aria-label="Đặt lại"
            onClick={() => { reset({ apartmentCode: '' }); router.push('/'); }}
            className="h-12 lg:h-14 w-12 lg:w-14 flex items-center justify-center bg-zinc-100 text-zinc-500 rounded-xl hover:bg-zinc-200 active:scale-95 transition-all shrink-0"
          >
            <LuRotateCcw className="w-5 h-5 lg:w-6 lg:h-6" />
          </button>
        </form>

        {errors.apartmentCode && (
          <p className="text-xs text-red-500 mt-2 ml-1">
            {errors.apartmentCode.message}
          </p>
        )}

        {hasResult && (
          <div className="flex items-center gap-1.5 mt-3">
            <LuCircleCheck className="w-3.5 h-3.5 text-green-500 shrink-0" />
            <p className="text-xs lg:text-sm text-green-600">Tìm thấy căn hộ</p>
          </div>
        )}

        {!hasResult && !notFound && (
          <div className="flex items-center gap-1.5 mt-3">
            <LuInfo className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
            <p className="text-xs lg:text-sm text-zinc-400">Ví dụ: P1.01.12A</p>
          </div>
        )}
      </div>
    </section>
  );
}
