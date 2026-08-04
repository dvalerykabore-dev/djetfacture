'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function RootPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/login');
  }, [router]);

  return (
    <div className="min-h-screen bg-[#0B3B36] flex items-center justify-center text-white">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 border-4 border-emerald-400 border-t-transparent rounded-full animate-spin" />
        <span className="font-bold text-sm">Redirection vers DJETFACTURE...</span>
      </div>
    </div>
  );
}
