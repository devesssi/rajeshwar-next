'use client';
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function FaqAccordion({ items }) {
  const [openIdx, setOpenIdx] = useState(0);

  return (
    <div className="space-y-3 max-w-3xl mx-auto">
      {items.map((item, idx) => {
        const isOpen = openIdx === idx;
        return (
          <div
            key={idx}
            className="rounded-xl border border-border/80 bg-card/60 backdrop-blur-sm overflow-hidden transition-all"
          >
            <button
              onClick={() => setOpenIdx(isOpen ? -1 : idx)}
              className="flex w-full items-center justify-between p-4 sm:p-5 text-left text-sm sm:text-base font-semibold text-foreground hover:text-primary transition-colors"
            >
              <span>{item.q}</span>
              <ChevronDown
                className={cn(
                  "h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200",
                  isOpen && "rotate-180 text-primary"
                )}
              />
            </button>
            {isOpen && (
              <div className="px-4 pb-4 sm:px-5 sm:pb-5 text-xs sm:text-sm text-muted-foreground leading-relaxed animate-accordion-down">
                {item.a}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
