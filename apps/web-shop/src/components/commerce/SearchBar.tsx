import * as React from 'react';
import { useRef, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, Clock, TrendingUp, SearchIcon, LayoutGrid } from 'lucide-react';
import { productService, type PopularSearch } from '@/modules/products/services/product.service';
import { CATEGORIES } from '@/lib/categories';
import { cn, debounce } from '@/lib/utils';

interface DropdownItem {
  id: string;
  type: 'recent' | 'popular' | 'suggestion' | 'category';
  label: string;
  count?: number;
  categoryId?: string;
}

const SECTION_META: Record<DropdownItem['type'], { label: string; icon: React.ReactNode }> = {
  category: { label: 'Categories', icon: <LayoutGrid className="size-3" /> },
  suggestion: { label: 'Products', icon: <SearchIcon className="size-3" /> },
  recent: { label: 'Recent', icon: <Clock className="size-3" /> },
  popular: { label: 'Trending', icon: <TrendingUp className="size-3" /> },
};

const SECTION_ORDER: DropdownItem['type'][] = ['category', 'suggestion', 'recent', 'popular'];

function Highlight({ text, query }: { text: string; query: string }) {
  const q = query.trim().toLowerCase();
  if (!q) return <>{text}</>;
  const index = text.toLowerCase().indexOf(q);
  if (index === -1) return <>{text}</>;
  return (
    <>
      {text.slice(0, index)}
      <mark className="rounded-sm bg-primary/15 px-0.5 text-primary">
        {text.slice(index, index + q.length)}
      </mark>
      {text.slice(index + q.length)}
    </>
  );
}

export interface SearchBarProps {
  autoFocus?: boolean;
  size?: 'md' | 'lg';
  className?: string;
  onSelect?: () => void;
}

export function SearchBar({ autoFocus, size = 'md', className, onSelect }: SearchBarProps) {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [recent, setRecent] = useState<string[]>([]);
  const [popular, setPopular] = useState<PopularSearch[]>([]);
  const wrapRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [dropdownItems, setDropdownItems] = useState<DropdownItem[]>([]);

  useEffect(() => {
    if (open && !query) {
      void Promise.all([
        productService.getRecentSearches(5).catch(() => []),
        productService.getPopularSearches(5).catch(() => []),
      ]).then(([r, p]) => {
        setRecent(r);
        setPopular(p);
      });
    }
  }, [open, query]);

  const runSuggestions = useCallback(
    debounce(async (q: string) => {
      if (q.length < 2) {
        setSuggestions([]);
        return;
      }
      try {
        const res = await productService.getSuggestions(q, 6);
        setSuggestions(res.suggestions || []);
      } catch {
        setSuggestions([]);
      }
    }, 200),
    [],
  );

  useEffect(() => {
    if (query) void runSuggestions(query);
    else setSuggestions([]);
  }, [query, runSuggestions]);

  useEffect(() => {
    let items: DropdownItem[] = [];
    if (query) {
      const q = query.trim().toLowerCase();
      const categoryMatches: DropdownItem[] = q
        ? CATEGORIES.filter(
            (c) => c.label.toLowerCase().includes(q) || c.id.toLowerCase().includes(q),
          ).map((c) => ({ id: `c-${c.id}`, type: 'category', label: c.label, categoryId: c.id }))
        : [];
      items = [
        ...categoryMatches,
        ...suggestions.map((s) => ({ id: `s-${s}`, type: 'suggestion' as const, label: s })),
      ];
    } else {
      items = [
        ...recent.map((r) => ({ id: `r-${r}`, type: 'recent' as const, label: r })),
        ...popular.map((p) => ({
          id: `p-${p.query}`,
          type: 'popular' as const,
          label: p.query,
          count: p.count,
        })),
      ];
    }
    setDropdownItems(items);
    setActiveIndex(-1);
  }, [suggestions, recent, popular, query]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const go = (q: string) => {
    const trimmed = q.trim();
    setOpen(false);
    inputRef.current?.blur();
    if (!trimmed) return;
    productService.trackSearch(trimmed).catch(() => {});
    navigate(`/products?q=${encodeURIComponent(trimmed)}`);
    onSelect?.();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, dropdownItems.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, -1));
    } else if (e.key === 'Enter') {
      if (activeIndex >= 0 && dropdownItems[activeIndex]) {
        const item = dropdownItems[activeIndex];
        if (item.type === 'category' && item.categoryId) {
          go(item.label);
        } else {
          go(item.label);
        }
      } else {
        go(query);
      }
    } else if (e.key === 'Escape') {
      setOpen(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    go(query);
  };

  const grouped = SECTION_ORDER.filter((t) => dropdownItems.some((i) => i.type === t)).map((t) => ({
    type: t,
    items: dropdownItems.filter((i) => i.type === t),
  }));

  return (
    <div ref={wrapRef} className={cn('relative w-full', className)}>
      <form onSubmit={handleSubmit} className="relative">
        <Search
          className={cn(
            'pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground',
            size === 'lg' ? 'size-5' : 'size-4',
          )}
        />
        <input
          ref={inputRef}
          type="search"
          role="combobox"
          aria-expanded={open && dropdownItems.length > 0}
          aria-controls="search-dropdown"
          aria-autocomplete="list"
          autoComplete="off"
          autoFocus={autoFocus}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="Search for products, brands and more..."
          className={cn(
            'w-full rounded-lg border border-input bg-background text-foreground transition-all placeholder:text-muted-foreground/70 focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/25',
            size === 'lg' ? 'h-12 pl-11 pr-10 text-base' : 'h-10 pl-10 pr-9 text-sm',
          )}
        />
        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery('');
              setSuggestions([]);
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-0.5 text-muted-foreground transition-colors hover:text-foreground"
            aria-label="Clear search"
          >
            <X className="size-4" />
          </button>
        )}
      </form>

      {open && dropdownItems.length > 0 && (
        <div
          id="search-dropdown"
          className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-lg border border-border bg-popover shadow-lg"
        >
          {grouped.map(({ type, items }, groupIndex) => (
            <div key={type} className={cn(groupIndex > 0 && 'border-t border-border')}>
              <div className="flex items-center gap-1.5 px-4 pb-1 pt-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                {SECTION_META[type].icon} {SECTION_META[type].label}
              </div>
              {items.map((item) => {
                const flatIndex = dropdownItems.indexOf(item);
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => go(item.label)}
                    onMouseEnter={() => setActiveIndex(flatIndex)}
                    className={cn(
                      'flex w-full items-center justify-between gap-3 px-4 py-2.5 text-left text-sm transition-colors',
                      activeIndex === flatIndex
                        ? 'bg-accent text-foreground'
                        : 'text-muted-foreground',
                    )}
                  >
                    <span className="flex min-w-0 items-center gap-3">
                      {type === 'category' && (
                        <LayoutGrid className="size-3.5 shrink-0 text-primary" />
                      )}
                      {type === 'recent' && <Clock className="size-3.5 shrink-0" />}
                      {type === 'popular' && <TrendingUp className="size-3.5 shrink-0" />}
                      {type === 'suggestion' && <Search className="size-3.5 shrink-0" />}
                      <span className="truncate">
                        <Highlight text={item.label} query={query} />
                      </span>
                    </span>
                    {item.count != null && (
                      <span className="shrink-0 text-xs text-muted-foreground/60">
                        {item.count.toLocaleString('en-IN')}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
