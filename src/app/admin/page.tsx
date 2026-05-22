import { Suspense } from 'react';
import Link from 'next/link';
import { RiAddLine, RiLoader4Line } from 'react-icons/ri';
import { createClient } from '@/utils/supabase/server';
import ApartmentTable from './_components/ApartmentTable';

const PER_PAGE = 10;

const SORT_MAP: Record<string, { column: string; ascending: boolean }> = {
  code_asc:     { column: 'code',       ascending: true  },
  code_desc:    { column: 'code',       ascending: false },
  created_desc: { column: 'created_at', ascending: false },
  created_asc:  { column: 'created_at', ascending: true  },
};

interface PageProps {
  searchParams: Promise<{ page?: string; search?: string; sort?: string }>;
}

export default async function AdminListPage({ searchParams }: PageProps) {
  const { page: pageStr, search = '', sort = 'code_asc' } = await searchParams;
  const page = Math.max(1, Number(pageStr ?? 1));
  const from = (page - 1) * PER_PAGE;

  const supabase = await createClient();
  const sortOpt = SORT_MAP[sort] ?? SORT_MAP['code_asc'];

  let query = supabase
    .from('apartments')
    .select('*', { count: 'exact' })
    .order(sortOpt.column, { ascending: sortOpt.ascending })
    .range(from, from + PER_PAGE - 1);

  if (search.trim()) {
    query = query.ilike('code', `%${search.trim()}%`);
  }

  const { data: apartments, count } = await query;

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Danh sách căn hộ</h1>
          <p className="mt-0.5 text-sm text-gray-500">
            Quản lý danh sách tất cả căn hộ trong hệ thống.
          </p>
        </div>
        <Link
          href="/admin/create"
          className="flex items-center gap-2 rounded-lg bg-red-700 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-800"
        >
          <RiAddLine className="text-base" />
          Tạo căn hộ mới
        </Link>
      </div>

      <Suspense
        fallback={
          <div className="flex items-center justify-center py-20 text-gray-400">
            <RiLoader4Line className="animate-spin text-2xl" />
          </div>
        }
      >
        <ApartmentTable
          apartments={apartments ?? []}
          total={count ?? 0}
          page={page}
          search={search}
          sort={sort}
        />
      </Suspense>
    </div>
  );
}
