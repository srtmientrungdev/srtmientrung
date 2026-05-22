'use client';

import { useState, useRef, useCallback, useTransition } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import {
  RiArrowLeftLine,
  RiUploadCloud2Line,
  RiAddLine,
  RiDragMove2Line,
  RiLoader4Line,
  RiAlertLine,
} from 'react-icons/ri';
import { updateApartment } from '../../actions';

interface ImageEntry {
  id: string;
  preview: string;
  url: string | null;
  uploading: boolean;
  error: string | null;
}

function makeId() {
  return Math.random().toString(36).slice(2);
}

async function uploadFile(file: File): Promise<string> {
  const fd = new FormData();
  fd.append('file', file);
  const res = await fetch('/api/upload', { method: 'POST', body: fd });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error ?? 'Upload thất bại');
  return json.url as string;
}

interface Props {
  id: string;
  initialCode: string;
  initialImages: string[];
}

export default function EditForm({ id, initialCode, initialImages }: Props) {
  const router = useRouter();
  const [apartmentCode, setApartmentCode] = useState(initialCode);
  const [entries, setEntries] = useState<ImageEntry[]>(() =>
    initialImages.map((url) => ({
      id: makeId(),
      preview: url,
      url,
      uploading: false,
      error: null,
    })),
  );
  const [isDragging, setIsDragging] = useState(false);
  const [isPending, startTransition] = useTransition();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const addMoreRef = useRef<HTMLInputElement>(null);

  const uploadFiles = useCallback(async (files: File[]) => {
    const newEntries: ImageEntry[] = files.map((f) => ({
      id: makeId(),
      preview: URL.createObjectURL(f),
      url: null,
      uploading: true,
      error: null,
    }));

    setEntries((prev) => [...prev, ...newEntries]);

    await Promise.all(
      newEntries.map(async (entry, i) => {
        try {
          const url = await uploadFile(files[i]);
          setEntries((prev) =>
            prev.map((e) => (e.id === entry.id ? { ...e, url, uploading: false } : e)),
          );
        } catch (err) {
          const message = err instanceof Error ? err.message : 'Lỗi upload';
          setEntries((prev) =>
            prev.map((e) =>
              e.id === entry.id ? { ...e, uploading: false, error: message } : e,
            ),
          );
          toast.error(`${files[i].name}: ${message}`);
        }
      }),
    );
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => setIsDragging(false), []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const files = Array.from(e.dataTransfer.files).filter((f) => f.type.startsWith('image/'));
      if (files.length) uploadFiles(files);
    },
    [uploadFiles],
  );

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files ?? []);
      if (files.length) uploadFiles(files);
      e.target.value = '';
    },
    [uploadFiles],
  );

  const removeEntry = useCallback((id: string) => {
    setEntries((prev) => {
      const entry = prev.find((e) => e.id === id);
      if (entry && entry.preview.startsWith('blob:')) URL.revokeObjectURL(entry.preview);
      return prev.filter((e) => e.id !== id);
    });
  }, []);

  const readyImages = entries.filter((e) => e.url).map((e) => e.url!);
  const hasUploading = entries.some((e) => e.uploading);

  const handleSubmit = useCallback(() => {
    if (!apartmentCode.trim()) { toast.error('Vui lòng nhập mã căn hộ'); return; }
    if (readyImages.length === 0) { toast.error('Cần ít nhất một hình ảnh'); return; }

    startTransition(async () => {
      const result = await updateApartment(id, apartmentCode, readyImages);
      if (result.success) {
        toast.success('Cập nhật thành công!');
        router.push('/admin');
      } else {
        toast.error(result.error ?? 'Có lỗi xảy ra');
      }
    });
  }, [id, apartmentCode, readyImages, router]);

  return (
    <div className="flex gap-6 rounded-xl bg-white p-6 shadow-sm">
      {/* Left: form */}
      <div className="flex w-72 shrink-0 flex-col gap-5">
        {/* Back button */}
        <button
          onClick={() => router.push('/admin')}
          className="flex w-fit items-center gap-2 text-sm text-gray-500 hover:text-gray-700"
        >
          <RiArrowLeftLine /> Quay lại danh sách
        </button>

        {/* Mã căn hộ */}
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-gray-700">
            Mã căn hộ <span className="text-red-600">*</span>
          </label>
          <input
            value={apartmentCode}
            onChange={(e) => setApartmentCode(e.target.value)}
            placeholder="Nhập mã căn hộ (VD: P1.01.12A)"
            className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100"
          />
        </div>

        {/* Drop zone */}
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-gray-700">
            Thêm hình ảnh
          </label>
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed px-4 py-8 text-center transition-colors ${
              isDragging ? 'border-red-400 bg-red-50' : 'border-gray-200 bg-gray-50 hover:border-gray-300'
            }`}
          >
            <RiUploadCloud2Line className="text-2xl text-gray-400" />
            <p className="text-sm text-gray-500">Kéo thả hoặc</p>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 rounded-lg bg-red-700 px-4 py-2 text-sm font-semibold text-white hover:bg-red-800"
            >
              <RiUploadCloud2Line /> Chọn ảnh
            </button>
            <p className="text-xs text-gray-400">JPG, PNG, WEBP. Tối đa 10MB/ảnh</p>
          </div>
          <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden" onChange={handleFileChange} />
        </div>

        {/* Submit */}
        <button
          type="button"
          disabled={isPending || hasUploading}
          onClick={handleSubmit}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-red-700 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isPending && <RiLoader4Line className="animate-spin" />}
          {isPending ? 'Đang lưu...' : hasUploading ? 'Đang tải ảnh...' : 'Lưu thay đổi'}
        </button>
      </div>

      {/* Right: gallery */}
      <div className="flex-1">
        <p className="mb-0.5 font-semibold text-gray-800">
          Hình ảnh ({readyImages.length})
        </p>
        <p className="mb-4 text-xs text-gray-500">Bấm ✕ để xóa ảnh khỏi danh sách.</p>

        <div className="flex flex-wrap gap-3">
          {entries.map((entry) => (
            <div
              key={entry.id}
              className="relative h-32 w-32 shrink-0 overflow-hidden rounded-lg border border-gray-200 bg-gray-100"
            >
              <Image src={entry.preview} alt="preview" fill className="object-cover" />

              {entry.uploading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                  <RiLoader4Line className="animate-spin text-xl text-white" />
                </div>
              )}
              {entry.error && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 bg-red-900/60 px-1 text-center">
                  <RiAlertLine className="text-lg text-white" />
                  <span className="text-xs text-white">Lỗi upload</span>
                </div>
              )}
              {!entry.uploading && !entry.error && (
                <div className="absolute left-1 top-1 cursor-grab rounded bg-white/80 p-0.5 text-gray-500">
                  <RiDragMove2Line className="text-sm" />
                </div>
              )}
              <button
                onClick={() => removeEntry(entry.id)}
                className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-white/90 text-xs text-gray-600 shadow hover:bg-white"
              >
                ✕
              </button>
            </div>
          ))}

          <button
            type="button"
            onClick={() => addMoreRef.current?.click()}
            className="flex h-32 w-32 shrink-0 flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed border-gray-200 bg-gray-50 text-gray-400 hover:border-gray-300 hover:text-gray-500"
          >
            <RiAddLine className="text-2xl" />
            <span className="text-xs">Thêm ảnh</span>
          </button>
          <input ref={addMoreRef} type="file" accept="image/*" multiple className="hidden" onChange={handleFileChange} />
        </div>
      </div>
    </div>
  );
}
