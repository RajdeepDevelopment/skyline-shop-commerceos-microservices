import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  BadgeCheck,
  Check,
  ChevronDown,
  Loader2,
  MessageSquarePlus,
  SearchX,
  ThumbsUp,
} from 'lucide-react';
import { productService } from '@/modules/products/services/product.service';
import type { ReviewSort } from '@/modules/products/types/product.types';
import { useAuthStore } from '@/modules/auth/stores/auth.store';
import { EmptyState } from '@/components/commerce/EmptyState';
import { StarRating } from '@/components/ui/star-rating';
import { Progress } from '@/components/ui/progress';
import { DialogRoot, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/toast';
import { cn } from '@/lib/utils';

const PAGE_SIZE = 8;

const SORT_OPTIONS: { value: ReviewSort; label: string }[] = [
  { value: 'newest', label: 'Newest first' },
  { value: 'oldest', label: 'Oldest first' },
  { value: 'rating-desc', label: 'Highest rated' },
  { value: 'rating-asc', label: 'Lowest rated' },
  { value: 'helpful', label: 'Most helpful' },
];

export function ProductReviews({ productId }: { productId: string }) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAuthStore();

  const [ratingFilter, setRatingFilter] = useState<number | null>(null);
  const [sort, setSort] = useState<ReviewSort>('helpful');
  const [page, setPage] = useState(1);
  const [writeOpen, setWriteOpen] = useState(false);

  const summary = useQuery({
    queryKey: ['product', productId, 'reviews', 'summary'],
    queryFn: () => productService.getReviewSummary(productId),
    staleTime: 60_000,
  });

  const reviewsQuery = useQuery({
    queryKey: ['product', productId, 'reviews', ratingFilter, sort, page],
    queryFn: () =>
      productService.getReviews(productId, {
        rating: ratingFilter ?? undefined,
        sort,
        page,
        limit: PAGE_SIZE,
      }),
    staleTime: 30_000,
  });

  const helpfulMutation = useMutation({
    mutationFn: (reviewId: string) => productService.markReviewHelpful(productId, reviewId),
    onSuccess: (result, reviewId) => {
      toast.success(result.alreadyVoted ? 'Already marked helpful' : 'Thanks for your feedback');
      if (!result.alreadyVoted) {
        queryClient.setQueryData(
          ['product', productId, 'reviews', ratingFilter, sort, page],
          (old: any) =>
            old && {
              ...old,
              reviews: old.reviews.map((r: any) =>
                r.id === reviewId ? { ...r, helpfulCount: r.helpfulCount + 1 } : r,
              ),
            },
        );
      }
    },
    onError: () => toast.error('Something went wrong. Please try again.'),
  });

  const createMutation = useMutation({
    mutationFn: (input: {
      rating: number;
      title?: string;
      comment?: string;
      reviewerName?: string;
    }) => productService.createReview(productId, input),
    onSuccess: () => {
      toast.success('Review submitted');
      setWriteOpen(false);
      setRatingFilter(null);
      setPage(1);
      void queryClient.invalidateQueries({ queryKey: ['product', productId, 'reviews'] });
      void queryClient.invalidateQueries({ queryKey: ['product', productId] });
    },
    onError: () => toast.error('Could not submit review. Please try again.'),
  });

  const handleHelpful = (reviewId: string) => {
    if (!isAuthenticated) return navigate('/login');
    void helpfulMutation.mutate(reviewId);
  };

  const setFilter = (rating: number | null) => {
    setRatingFilter(rating);
    setPage(1);
  };

  const changeSort = (next: ReviewSort) => {
    setSort(next);
    setPage(1);
  };

  const total = summary.data?.totalReviews ?? 0;
  const average = summary.data?.averageRating ?? 0;
  const reviews = reviewsQuery.data?.reviews ?? [];
  const isLoading = reviewsQuery.isLoading;
  const isError = reviewsQuery.isError;
  const hasMore = reviewsQuery.data ? page < reviewsQuery.data.totalPages : false;

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[300px_1fr]">
      {/* ===== Summary ===== */}
      <div className="h-fit rounded-lg border border-border bg-card p-6 text-center lg:sticky lg:top-28">
        {summary.isLoading ? (
          <div className="space-y-3">
            <div className="mx-auto h-12 w-20 animate-pulse rounded bg-accent/60" />
            <div className="mx-auto h-4 w-28 animate-pulse rounded bg-accent/60" />
          </div>
        ) : total === 0 ? (
          <>
            <p className="text-4xl font-bold text-foreground">—</p>
            <p className="mt-2 text-sm text-muted-foreground">No ratings yet</p>
          </>
        ) : (
          <>
            <p className="text-5xl font-bold text-foreground">{average.toFixed(1)}</p>
            <StarRating value={average} showValue={false} className="mt-2 justify-center" />
            <p className="mt-1 text-xs text-muted-foreground">
              Based on {total.toLocaleString('en-IN')} rating{total === 1 ? '' : 's'}
            </p>
          </>
        )}

        <div className="mt-5 space-y-2 text-left">
          {[5, 4, 3, 2, 1].map((r) => {
            const bucket = summary.data?.distribution.find((d) => d.rating === r);
            const active = ratingFilter === r;
            return (
              <button
                key={r}
                onClick={() => setFilter(active ? null : r)}
                className={cn(
                  'flex w-full items-center gap-2 rounded-md px-1.5 py-0.5 text-xs transition-colors',
                  active ? 'bg-primary/10' : 'hover:bg-accent',
                )}
              >
                <span className="w-6 shrink-0 text-left font-semibold text-muted-foreground">
                  {r}★
                </span>
                <Progress
                  value={bucket?.percentage ?? 0}
                  className={cn('h-1.5 flex-1', active && 'bg-primary/15')}
                />
                <span className="w-9 shrink-0 text-right tabular-nums text-muted-foreground">
                  {bucket?.count ?? 0}
                </span>
              </button>
            );
          })}
        </div>

        <Button
          variant="primary"
          className="mt-6 w-full"
          onClick={() => {
            if (!isAuthenticated) return navigate('/login');
            setWriteOpen(true);
          }}
        >
          <MessageSquarePlus className="size-4" /> Write a Review
        </Button>
      </div>

      {/* ===== Reviews list ===== */}
      <div>
        {/* Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              onClick={() => setFilter(null)}
              className={cn(
                'rounded-full border px-3 py-1 text-xs font-semibold transition-colors',
                ratingFilter === null
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-border text-muted-foreground hover:border-primary/40 hover:text-foreground',
              )}
            >
              All
            </button>
            {[5, 4, 3, 2, 1].map((r) => (
              <button
                key={r}
                onClick={() => setFilter(ratingFilter === r ? null : r)}
                className={cn(
                  'rounded-full border px-3 py-1 text-xs font-semibold transition-colors',
                  ratingFilter === r
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-border text-muted-foreground hover:border-primary/40 hover:text-foreground',
                )}
              >
                {r}★
              </button>
            ))}
          </div>

          <div className="relative">
            <select
              value={sort}
              onChange={(e) => changeSort(e.target.value as ReviewSort)}
              aria-label="Sort reviews"
              className="h-9 cursor-pointer appearance-none rounded-lg border border-border bg-card pl-3 pr-8 text-xs font-semibold text-foreground outline-none transition-colors hover:border-primary/40 focus:border-primary"
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
          </div>
        </div>

        {/* Loading skeletons */}
        {isLoading && (
          <div className="mt-4 space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="animate-pulse rounded-lg border border-border bg-card p-5">
                <div className="flex items-center gap-3">
                  <div className="size-9 rounded-full bg-accent/60" />
                  <div className="space-y-1.5">
                    <div className="h-3 w-28 rounded bg-accent/60" />
                    <div className="h-2.5 w-20 rounded bg-accent/60" />
                  </div>
                </div>
                <div className="mt-3 h-3 w-2/3 rounded bg-accent/60" />
                <div className="mt-2 h-3 w-full rounded bg-accent/60" />
                <div className="mt-2 h-3 w-4/5 rounded bg-accent/60" />
              </div>
            ))}
          </div>
        )}

        {/* Error state */}
        {isError && (
          <div className="mt-4">
            <EmptyState
              className="rounded-lg border border-border bg-card py-14"
              icon={<SearchX className="size-10 text-muted-foreground" />}
              title="Couldn't load reviews"
              description="Something went wrong while loading reviews for this product."
              actionLabel="Try Again"
              onAction={() => void reviewsQuery.refetch()}
            />
          </div>
        )}

        {/* Empty state */}
        {!isLoading && !isError && reviews.length === 0 && (
          <div className="mt-4">
            <EmptyState
              className="rounded-lg border border-border bg-card py-14"
              icon={<MessageSquarePlus className="size-10 text-muted-foreground" />}
              title={ratingFilter ? `No ${ratingFilter}★ reviews` : 'No reviews yet'}
              description={
                ratingFilter
                  ? 'There are no reviews at this rating. Try another filter.'
                  : 'Be the first to share your experience with this product.'
              }
              actionLabel={ratingFilter ? 'Show all reviews' : 'Write a Review'}
              onAction={() =>
                ratingFilter
                  ? setFilter(null)
                  : isAuthenticated
                    ? setWriteOpen(true)
                    : navigate('/login')
              }
            />
          </div>
        )}

        {/* Review cards */}
        {!isLoading && !isError && reviews.length > 0 && (
          <>
            <div className="mt-4 space-y-4">
              {reviews.map((r) => (
                <div key={r.id} className="rounded-lg border border-border bg-card p-5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <span className="flex size-9 items-center justify-center rounded-full bg-primary/15 text-sm font-bold text-primary">
                        {r.reviewerName[0]?.toUpperCase() ?? 'U'}
                      </span>
                      <div>
                        <p className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
                          {r.reviewerName}
                          {r.verified && (
                            <BadgeCheck
                              className="size-4 text-success"
                              aria-label="Verified purchase"
                            />
                          )}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(r.date).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                          {r.verified && ' · Verified Purchase'}
                        </p>
                      </div>
                    </div>
                    <StarRating value={r.rating} size="xs" />
                  </div>

                  {r.title && <p className="mt-3 font-semibold text-foreground">{r.title}</p>}
                  {r.comment && (
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                      {r.comment}
                    </p>
                  )}

                  <div className="mt-3 flex items-center gap-3">
                    <button
                      onClick={() => handleHelpful(r.id)}
                      disabled={helpfulMutation.isPending}
                      className={cn(
                        'inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold transition-colors',
                        'border-border text-muted-foreground hover:border-primary/40 hover:text-primary',
                      )}
                    >
                      <ThumbsUp className="size-3.5" /> Helpful · {r.helpfulCount}
                    </button>
                    {r.helpfulCount > 0 && (
                      <span className="text-xs text-muted-foreground">
                        {r.helpfulCount} people found this helpful
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {hasMore && (
              <div className="mt-6 text-center">
                <Button
                  variant="outline"
                  onClick={() => setPage((p) => p + 1)}
                  disabled={reviewsQuery.isFetching}
                >
                  {reviewsQuery.isFetching && <Loader2 className="size-4 animate-spin" />}
                  Load more reviews
                </Button>
              </div>
            )}
          </>
        )}
      </div>

      {/* ===== Write a Review dialog ===== */}
      <DialogRoot open={writeOpen} onOpenChange={setWriteOpen}>
        <DialogContent>
          <DialogTitle>Write a Review</DialogTitle>
          <DialogDescription>Share your experience with this product.</DialogDescription>
          <ReviewForm
            submitting={createMutation.isPending}
            onSubmit={(input) => void createMutation.mutate(input)}
          />
        </DialogContent>
      </DialogRoot>
    </div>
  );
}

function ReviewForm({
  submitting,
  onSubmit,
}: {
  submitting: boolean;
  onSubmit: (input: { rating: number; title?: string; comment?: string }) => void;
}) {
  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [touched, setTouched] = useState(false);
  const valid = rating >= 1 && (comment.trim().length >= 10 || title.trim().length >= 3);

  const submit = () => {
    setTouched(true);
    if (!valid) return;
    onSubmit({ rating, title: title.trim() || undefined, comment: comment.trim() || undefined });
  };

  return (
    <div className="mt-5 space-y-4">
      <div>
        <label className="mb-1.5 block text-sm font-medium text-foreground">Your rating</label>
        <div className="flex items-center gap-1" role="radiogroup" aria-label="Star rating">
          {[1, 2, 3, 4, 5].map((s) => (
            <button
              key={s}
              type="button"
              role="radio"
              aria-checked={rating === s}
              onClick={() => setRating(s)}
              className="p-0.5 transition-transform hover:scale-110"
              aria-label={`${s} star${s > 1 ? 's' : ''}`}
            >
              <StarRating value={s} size="md" />
            </button>
          ))}
        </div>
        {touched && rating === 0 && (
          <p className="mt-1 text-xs text-destructive">Please select a rating</p>
        )}
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-foreground">
          Review title <span className="text-muted-foreground">(optional)</span>
        </label>
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Summarise your review"
          maxLength={120}
        />
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-foreground">Your review</label>
        <Textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="What did you like or dislike? How was delivery and quality?"
          maxLength={1000}
        />
        <div className="mt-1 flex justify-between text-xs text-muted-foreground">
          <span>
            {touched && comment.trim().length > 0 && comment.trim().length < 10
              ? 'Please write at least 10 characters'
              : ''}
          </span>
          <span>{comment.length}/1000</span>
        </div>
      </div>

      <div className="flex gap-3 pt-1">
        <Button
          variant="outline"
          className="flex-1"
          onClick={() => setRating(0)}
          disabled={submitting}
        >
          Reset
        </Button>
        <Button
          variant="primary"
          className="flex-1"
          onClick={submit}
          disabled={submitting || !valid}
        >
          {submitting ? <Loader2 className="size-4 animate-spin" /> : <Check className="size-4" />}
          Submit Review
        </Button>
      </div>
    </div>
  );
}
