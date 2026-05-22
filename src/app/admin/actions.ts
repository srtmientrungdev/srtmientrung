'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

export interface ActionResult {
  success: boolean;
  error?: string;
}

export async function saveApartment(code: string, images: string[]): Promise<ActionResult> {
  if (!code.trim()) return { success: false, error: 'Mã căn hộ không được để trống' };
  if (images.length === 0) return { success: false, error: 'Cần ít nhất một hình ảnh' };

  const supabase = await createClient();
  const { error } = await supabase.from('apartments').insert({ code: code.trim(), images });

  if (error) {
    if (error.code === '23505') return { success: false, error: `Mã căn hộ "${code}" đã tồn tại` };
    return { success: false, error: error.message };
  }

  revalidatePath('/admin');
  return { success: true };
}

export async function updateApartment(
  id: string,
  code: string,
  images: string[],
): Promise<ActionResult> {
  if (!code.trim()) return { success: false, error: 'Mã căn hộ không được để trống' };
  if (images.length === 0) return { success: false, error: 'Cần ít nhất một hình ảnh' };

  const supabase = await createClient();
  const { error } = await supabase
    .from('apartments')
    .update({ code: code.trim(), images, updated_at: new Date().toISOString() })
    .eq('id', id);

  if (error) {
    if (error.code === '23505') return { success: false, error: `Mã căn hộ "${code}" đã tồn tại` };
    return { success: false, error: error.message };
  }

  revalidatePath('/admin');
  return { success: true };
}

export async function deleteApartment(id: string): Promise<ActionResult> {
  const supabase = await createClient();
  const { error } = await supabase.from('apartments').delete().eq('id', id);

  if (error) return { success: false, error: error.message };

  revalidatePath('/admin');
  return { success: true };
}
