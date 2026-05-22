import ApartmentCarousel from '@/components/ApartmentCarousel';
import Header from '@/components/Header';
import SearchForm from '@/components/SearchForm';
import { createClient } from '@/utils/supabase/server';

interface HomeProps {
  searchParams: Promise<{ code?: string }>;
}

export default async function Home({ searchParams }: HomeProps) {
  const { code: rawCode } = await searchParams;
  const code = rawCode?.trim().toUpperCase() ?? '';

  let images: string[] | null = null;
  let notFound = false;

  if (code) {
    const supabase = await createClient();
    const { data } = await supabase
      .from('apartments')
      .select('code, images')
      .ilike('code', code)
      .maybeSingle();

    if (data) {
      images = data.images as string[];
    } else {
      notFound = true;
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-linear-to-br from-[#fdf6f0] via-[#f7ece4] to-[#f0e0d6]">
      <Header />

      {/* Mobile: stacked  |  Desktop: 2-column side-by-side */}
      <main className="flex-1 flex flex-col lg:flex-row lg:overflow-hidden">
        {/* Left — search form, sticky & vertically centred */}
        <div className="lg:w-[42%] lg:h-[calc(100vh-72px)] lg:sticky lg:top-[72px] lg:overflow-hidden flex flex-col justify-center py-8 lg:py-0 lg:px-14">
          <SearchForm defaultCode={code} notFound={notFound} hasResult={!!images} />
        </div>

        {/* Right — carousel fills exact viewport height on desktop */}
        <div className="lg:w-[58%] lg:h-[calc(100vh-72px)] lg:sticky lg:top-[72px] flex flex-col py-4 lg:py-6 lg:pr-8 lg:pl-2">
          <ApartmentCarousel images={images} />
        </div>
      </main>
    </div>
  );
}
