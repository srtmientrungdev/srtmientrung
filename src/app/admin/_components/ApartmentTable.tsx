'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useRef, useState, useTransition } from 'react';
import { toast } from 'sonner';
import {
  RiSearchLine,
  RiEyeLine,
  RiPencilFill,
  RiDeleteBin6Line,
  RiArrowDownSLine,
  RiLoader4Line,
  RiCloseLine,
  RiCheckLine,
} from 'react-icons/ri';
import { deleteApartment } from '../actions';

interface Apartment {
  id: string;
  code: string;
  images: string[];
  created_at: string;
  updated_at: string;
}

interface Props {
  apartments: Apartment[];
  total: number;
  page: number;
  search: string;
  sort: string;
}

const SORT_OPTIONS = [
  { value: 'code_asc', label: 'Mã căn hộ (A-Z)' },
  { value: 'code_desc', label: 'Mã căn hộ (Z-A)' },
  { value: 'created_desc', label: 'Ngày tạo (mới nhất)' },
  { value: 'created_asc', label: 'Ngày tạo (cũ nhất)' },
];

const PER_PAGE = 10;

function formatDate(iso: string) {
  const d = new Date(iso);
  const p = (n: number) => String(n).padStart(2, '0');
  return `${p(d.getDate())}/${p(d.getMonth() + 1)}/${d.getFullYear()} ${p(d.getHours())}:${p(d.getMinutes())}`;
}

export default function ApartmentTable({ apartments, total, page, search, sort }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [searchInput, setSearchInput] = useState(search);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isMounted = useRef(false);

  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
      return;
    }
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      push({ search: searchInput, page: '1' });
    }, 400);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchInput]);

  const push = useCallback(
    (updates: Record<string, string>) => {
      const next = new URLSearchParams(params.toString());
      Object.entries(updates).forEach(([k, v]) => (v ? next.set(k, v) : next.delete(k)));
      startTransition(() => router.push(`${pathname}?${next.toString()}`));
    },
    [params, pathname, router],
  );

  const handleDelete = useCallback(
    async (id: string) => {
      setDeletingId(id);
      const result = await deleteApartment(id);
      setDeletingId(null);
      setPendingDeleteId(null);
      if (result.success) {
        toast.success('Đã xóa căn hộ');
        router.refresh();
      } else {
        toast.error(result.error ?? 'Xóa thất bại');
      }
    },
    [router],
  );

  const totalPages = Math.max(1, Math.ceil(total / PER_PAGE));
  const sortLabel = SORT_OPTIONS.find((o) => o.value === sort)?.label ?? SORT_OPTIONS[0].label;
  const pages = buildPageList(page, totalPages);

  return (
    <div className="rounded-xl bg-white shadow-sm">
      {/* Search + sort */}
      <div className="flex items-center gap-3 border-b border-gray-100 px-4 py-3">
        <div className="relative max-w-xs flex-1">
          <RiSearchLine className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Tìm kiếm mã căn hộ..."
            className="w-full rounded-lg border border-gray-200 py-2 pl-9 pr-10 text-sm outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100"
          />
          {isPending && (
            <RiLoader4Line className="absolute right-3 top-1/2 -translate-y-1/2 animate-spin text-gray-400" />
          )}
        </div>

        <div className="group relative ml-auto">
          <button className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 hover:border-gray-300">
            Sắp xếp: {sortLabel}
            <RiArrowDownSLine className="transition-transform group-focus-within:rotate-180" />
          </button>
          <div className="invisible absolute right-0 z-10 mt-1 w-52 rounded-lg border border-gray-100 bg-white opacity-0 shadow-lg transition-all group-focus-within:visible group-focus-within:opacity-100">
            {SORT_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => push({ sort: opt.value, page: '1' })}
                className={`block w-full px-4 py-2.5 text-left text-sm hover:bg-gray-50 ${opt.value === sort ? 'font-semibold text-red-700' : 'text-gray-700'
                  }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Table */}
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-100 bg-gray-50">
            <th className="w-12 px-4 py-3 text-left font-semibold text-gray-600">#</th>
            <th className="px-4 py-3 text-left font-semibold text-gray-600">Mã căn hộ</th>
            <th className="px-4 py-3 text-left font-semibold text-gray-600">Số lượng ảnh</th>
            <th className="px-4 py-3 text-left font-semibold text-gray-600">Ngày tạo</th>
            <th className="px-4 py-3 text-left font-semibold text-gray-600">Cập nhật cuối</th>
            <th className="px-4 py-3 text-left font-semibold text-gray-600">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {apartments.length === 0 ? (
            <tr>
              <td colSpan={6} className="px-4 py-10 text-center text-sm text-gray-400">
                Không tìm thấy căn hộ nào.
              </td>
            </tr>
          ) : (
            apartments.map((apt, i) => {
              const isConfirming = pendingDeleteId === apt.id;
              const isDeleting = deletingId === apt.id;

              return (
                <tr
                  key={apt.id}
                  className={`border-b border-gray-50 transition-colors ${isConfirming ? 'bg-red-50' : 'hover:bg-gray-50'
                    }`}
                >
                  <td className="px-4 py-3 text-gray-500">{(page - 1) * PER_PAGE + i + 1}</td>
                  <td className="px-4 py-3 font-medium text-gray-900">{apt.code}</td>
                  <td className="px-4 py-3 text-gray-600">{apt.images.length} ảnh</td>
                  <td className="px-4 py-3 text-gray-600">{formatDate(apt.created_at)}</td>
                  <td className="px-4 py-3 text-gray-600">{formatDate(apt.updated_at)}</td>
                  <td className="px-4 py-3">
                    {isConfirming ? (
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium text-red-600">Xóa căn hộ này?</span>
                        <button
                          onClick={() => setPendingDeleteId(null)}
                          className="flex h-8 items-center gap-1 rounded-md border border-gray-200 px-2 text-xs text-gray-600 hover:bg-gray-100"
                        >
                          <RiCloseLine /> Hủy
                        </button>
                        <button
                          disabled={isDeleting}
                          onClick={() => handleDelete(apt.id)}
                          className="flex h-8 items-center gap-1 rounded-md bg-red-600 px-2 text-xs font-semibold text-white hover:bg-red-700 disabled:opacity-60"
                        >
                          {isDeleting ? (
                            <RiLoader4Line className="animate-spin" />
                          ) : (
                            <RiCheckLine />
                          )}
                          Xóa
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => router.push(`/admin/edit/${apt.id}`)}
                          className="flex h-8 w-8 items-center justify-center rounded-md border border-gray-200 text-gray-500 hover:border-gray-300 hover:text-gray-700"
                        >
                          <RiPencilFill className="text-sm" />
                        </button>
                        <button
                          onClick={() => setPendingDeleteId(apt.id)}
                          className="flex h-8 w-8 items-center justify-center rounded-md border border-red-100 bg-red-50 text-red-500 hover:bg-red-100"
                        >
                          <RiDeleteBin6Line className="text-sm" />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="flex items-center justify-between px-4 py-3 text-sm text-gray-500">
        <span>
          Hiển thị {total === 0 ? 0 : (page - 1) * PER_PAGE + 1}–
          {Math.min(page * PER_PAGE, total)} của {total} căn hộ
        </span>
        <div className="flex items-center gap-1">
          <PageBtn disabled={page <= 1} onClick={() => push({ page: String(page - 1) })}>‹</PageBtn>
          {pages.map((p, i) =>
            p === '...' ? (
              <span key={`el-${i}`} className="px-1 text-gray-400">...</span>
            ) : (
              <PageBtn key={p} active={p === page} onClick={() => push({ page: String(p) })}>
                {p}
              </PageBtn>
            ),
          )}
          <PageBtn disabled={page >= totalPages} onClick={() => push({ page: String(page + 1) })}>›</PageBtn>
        </div>
      </div>
    </div>
  );
}

function PageBtn({
  children, active, disabled, onClick,
}: {
  children: React.ReactNode;
  active?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={`flex h-8 min-w-8 items-center justify-center rounded-md px-1 text-sm font-medium transition-colors disabled:opacity-40 ${active
        ? 'border border-red-600 bg-white text-red-700'
        : 'border border-gray-200 text-gray-600 hover:bg-gray-50'
        }`}
    >
      {children}
    </button>
  );
}

function buildPageList(current: number, total: number): (number | '...')[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages: (number | '...')[] = [1];
  if (current > 3) pages.push('...');
  for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) pages.push(i);
  if (current < total - 2) pages.push('...');
  pages.push(total);
  return pages;
}
