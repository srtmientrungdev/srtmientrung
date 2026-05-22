import { notFound } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import EditForm from './EditForm';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditApartmentPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: apartment } = await supabase
    .from('apartments')
    .select('*')
    .eq('id', id)
    .single();

  if (!apartment) notFound();

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900">Chỉnh sửa căn hộ</h1>
        <p className="mt-0.5 text-sm text-gray-500">
          <span className="text-gray-400">Dashboard</span>
          <span className="mx-1 text-gray-300">›</span>
          <span className="text-gray-400">Danh sách căn hộ</span>
          <span className="mx-1 text-gray-300">›</span>
          <span>{apartment.code}</span>
        </p>
      </div>

      <EditForm
        id={apartment.id}
        initialCode={apartment.code}
        initialImages={apartment.images as string[]}
      />
    </div>
  );
}
