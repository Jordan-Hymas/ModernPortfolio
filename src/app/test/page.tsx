'use client';

import Image from 'next/image';

export default function TestPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#F1F0EB] px-5 py-8 dark:bg-neutral-950">
      <main className="mx-auto flex min-h-[calc(100dvh-7rem)] w-full max-w-5xl items-center justify-center">
        <div className="relative">
          <div className="relative h-56 w-56 overflow-hidden rounded-full border-4 border-white shadow-[0_0_0_14px_rgba(255,255,255,0.34)] dark:border-neutral-100 dark:shadow-[0_0_0_14px_rgba(10,10,10,0.46)] sm:h-72 sm:w-72 md:h-80 md:w-80 lg:h-96 lg:w-96">
            <Image
              src="/ThisIsAGreatOne.png"
              alt="Profile image"
              fill
              priority
              className="object-cover object-center"
              sizes="(max-width: 640px) 224px, (max-width: 768px) 288px, (max-width: 1024px) 320px, 384px"
            />
          </div>
        </div>
      </main>
    </div>
  );
}
