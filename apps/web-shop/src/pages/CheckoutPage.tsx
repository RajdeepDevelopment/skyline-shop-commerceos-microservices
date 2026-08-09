import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  MapPin,
  Truck,
  CreditCard,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Smartphone,
  Banknote,
  Loader2,
  Lock,
} from 'lucide-react';
import { useCartStore } from '@/modules/cart/stores/cart.store';
import { useOrderStore } from '@/modules/orders/stores/order.store';
import { useAuthStore } from '@/modules/auth/stores/auth.store';
import { ProductImage } from '@/components/commerce/ProductImage';
import { Input } from '@/components/ui/input';
import { RadioGroupRoot, RadioItem } from '@/components/ui/radio-group';
import { Breadcrumbs } from '@/components/ui/breadcrumbs';
import { toast } from '@/components/ui/toast';
import { cn } from '@/lib/utils';
import { formatPrice } from '@/lib/format';
import { toPrice } from '@/lib/utils';

const addressSchema = z.object({
  fullName: z.string().min(3, 'Enter your full name'),
  phone: z.string().regex(/^[6-9]\d{9}$/, 'Enter a valid 10-digit mobile number'),
  line1: z.string().min(5, 'Enter your address'),
  line2: z.string().optional(),
  city: z.string().min(2, 'Enter your city'),
  state: z.string().min(2, 'Enter your state'),
  pincode: z.string().regex(/^[1-9]\d{5}$/, 'Enter a valid 6-digit pincode'),
});

type AddressForm = z.infer<typeof addressSchema>;

const PAYMENT_METHODS = [
  { id: 'upi', label: 'UPI', sub: 'Google Pay, PhonePe, Paytm & more', icon: Smartphone },
  { id: 'card', label: 'Credit / Debit Card', sub: 'Visa, Mastercard, RuPay', icon: CreditCard },
  { id: 'cod', label: 'Cash on Delivery', sub: 'Pay when your order arrives', icon: Banknote },
];

const STEPS = [
  { label: 'Address', icon: MapPin },
  { label: 'Delivery', icon: Truck },
  { label: 'Payment', icon: CreditCard },
];

export default function CheckoutPage() {
  const { items, subtotal, discount, totalAmount, clearCart } = useCartStore();
  const { user } = useAuthStore();
  const { createOrder } = useOrderStore();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [deliverySpeed, setDeliverySpeed] = useState<'standard' | 'express'>('standard');
  const [paymentMethod, setPaymentMethod] = useState<string>('upi');
  const [processing, setProcessing] = useState(false);

  const {
    register,
    handleSubmit,
    trigger,
    formState: { errors },
  } = useForm<AddressForm>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      fullName: `${user?.firstName ?? ''} ${user?.lastName ?? ''}`.trim(),
      phone: user?.phone ?? '',
      line1: '',
      line2: '',
      city: '',
      state: '',
      pincode: '',
    },
  });

  const itemCount = items.reduce((n, i) => n + i.quantity, 0);
  const deliveryCharge = totalAmount > 999 ? 0 : 49;
  const expressCharge = deliverySpeed === 'express' ? 79 : 0;
  const total = totalAmount + deliveryCharge + expressCharge;

  const nextFromAddress = async () => {
    const ok = await trigger();
    if (ok) setStep(1);
  };

  const onPlaceOrder = handleSubmit(async (data) => {
    if (paymentMethod === 'cod' && total > 100000) {
      toast.error('COD not available above ₹1,00,000');
      return;
    }
    setProcessing(true);
    try {
      const shippingAddress = `${data.fullName}, ${data.line1}${data.line2 ? ', ' + data.line2 : ''}, ${data.city}, ${data.state} - ${data.pincode}, ${data.phone}`;
      const result = await createOrder({
        items: items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          price:
            Math.round(
              toPrice(item.product.price) *
                (1 - (item.product.discountPercentage || 0) / 100) *
                100,
            ) / 100,
        })),
        shippingAddress,
        paymentMethod,
      });
      await clearCart();
      navigate('/order-confirmation', {
        replace: true,
        state: {
          orderId: result.orderId,
          address: {
            name: data.fullName,
            line: `${data.line1}${data.line2 ? ', ' + data.line2 : ''}`,
            city: `${data.city}, ${data.state} - ${data.pincode}`,
            phone: data.phone,
          },
          paymentMethod: PAYMENT_METHODS.find((p) => p.id === paymentMethod)?.label,
        },
      });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Checkout failed. Please try again.');
      setProcessing(false);
    }
  });

  const summary = useMemo(
    () =>
      items.map((i) => {
        const unit = toPrice(i.product.price) * (1 - (i.product.discountPercentage || 0) / 100);
        return { ...i, unit, lineTotal: unit * i.quantity };
      }),
    [items],
  );

  if (items.length === 0) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center px-4 py-24 text-center">
        <div className="flex size-20 items-center justify-center rounded-full bg-accent text-muted-foreground">
          <CreditCard className="size-9" />
        </div>
        <h1 className="mt-5 text-2xl font-bold text-foreground">Your cart is empty</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Add items to your cart before checking out.
        </p>
        <Link
          to="/products"
          className="mt-6 inline-flex h-11 items-center rounded-xl bg-primary px-6 text-sm font-semibold text-primary-foreground"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <Breadcrumbs
        items={[{ label: 'Home', to: '/' }, { label: 'Cart', to: '/cart' }, { label: 'Checkout' }]}
      />
      <h1 className="mt-4 text-2xl font-bold text-foreground">Checkout</h1>

      {/* Stepper */}
      <ol className="mt-6 flex items-center gap-2 sm:gap-3">
        {STEPS.map((s, i) => {
          const done = i < step;
          const active = i === step;
          return (
            <li key={s.label} className="flex flex-1 items-center gap-2 sm:gap-3">
              <button
                onClick={() => i < step && setStep(i)}
                className={cn(
                  'flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold sm:text-sm',
                  active && 'bg-primary text-primary-foreground',
                  done && 'bg-primary/15 text-primary',
                  !active && !done && 'bg-accent text-muted-foreground',
                )}
              >
                <s.icon className="size-4" />
                <span className="hidden sm:inline">{s.label}</span>
              </button>
              {i < STEPS.length - 1 && (
                <span className={cn('h-px flex-1', done ? 'bg-primary/50' : 'bg-border')} />
              )}
            </li>
          );
        })}
      </ol>

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          {/* Step 0: Address */}
          {step === 0 && (
            <form
              className="rounded-3xl border border-border bg-card p-6"
              onSubmit={(e) => e.preventDefault()}
            >
              <h2 className="flex items-center gap-2 text-lg font-bold text-foreground">
                <MapPin className="size-5 text-primary" /> Delivery Address
              </h2>
              <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-foreground">
                    Full Name
                  </label>
                  <Input
                    placeholder="Your full name"
                    error={!!errors.fullName}
                    {...register('fullName')}
                  />
                  {errors.fullName && (
                    <p className="mt-1 text-xs text-destructive">{errors.fullName.message}</p>
                  )}
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-foreground">
                    Mobile Number
                  </label>
                  <Input
                    placeholder="10-digit mobile"
                    inputMode="numeric"
                    error={!!errors.phone}
                    {...register('phone')}
                  />
                  {errors.phone && (
                    <p className="mt-1 text-xs text-destructive">{errors.phone.message}</p>
                  )}
                </div>
                <div className="sm:col-span-2">
                  <label className="mb-1.5 block text-sm font-medium text-foreground">
                    Address Line 1
                  </label>
                  <Input
                    placeholder="House no, building, street"
                    error={!!errors.line1}
                    {...register('line1')}
                  />
                  {errors.line1 && (
                    <p className="mt-1 text-xs text-destructive">{errors.line1.message}</p>
                  )}
                </div>
                <div className="sm:col-span-2">
                  <label className="mb-1.5 block text-sm font-medium text-foreground">
                    Address Line 2 (optional)
                  </label>
                  <Input placeholder="Locality, landmark" {...register('line2')} />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-foreground">City</label>
                  <Input placeholder="City" error={!!errors.city} {...register('city')} />
                  {errors.city && (
                    <p className="mt-1 text-xs text-destructive">{errors.city.message}</p>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-foreground">
                      State
                    </label>
                    <Input placeholder="State" error={!!errors.state} {...register('state')} />
                    {errors.state && (
                      <p className="mt-1 text-xs text-destructive">{errors.state.message}</p>
                    )}
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-foreground">
                      Pincode
                    </label>
                    <Input
                      placeholder="6-digit"
                      inputMode="numeric"
                      error={!!errors.pincode}
                      {...register('pincode')}
                    />
                    {errors.pincode && (
                      <p className="mt-1 text-xs text-destructive">{errors.pincode.message}</p>
                    )}
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => void nextFromAddress()}
                className="mt-6 inline-flex h-12 items-center gap-2 rounded-xl bg-primary px-8 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/25 hover:bg-primary/90"
              >
                Continue <ChevronRight className="size-4" />
              </button>
            </form>
          )}

          {/* Step 1: Delivery */}
          {step === 1 && (
            <div className="rounded-3xl border border-border bg-card p-6">
              <h2 className="flex items-center gap-2 text-lg font-bold text-foreground">
                <Truck className="size-5 text-primary" /> Delivery Speed
              </h2>
              <RadioGroupRoot
                className="mt-5 grid gap-3 sm:grid-cols-2"
                value={deliverySpeed}
                onValueChange={(v) => setDeliverySpeed(v)}
              >
                <RadioItem
                  value="standard"
                  label={
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold">Standard Delivery</p>
                        <p className="text-xs text-muted-foreground">3-5 business days</p>
                      </div>
                      <span className="font-bold">
                        {deliveryCharge === 0 ? 'FREE' : formatPrice(deliveryCharge)}
                      </span>
                    </div>
                  }
                />
                <RadioItem
                  value="express"
                  label={
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold">Express Delivery</p>
                        <p className="text-xs text-muted-foreground">Next day delivery</p>
                      </div>
                      <span className="font-bold">+{formatPrice(79)}</span>
                    </div>
                  }
                />
              </RadioGroupRoot>
              <div className="mt-6 flex items-center justify-between">
                <button
                  onClick={() => setStep(0)}
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-foreground"
                >
                  <ChevronLeft className="size-4" /> Back
                </button>
                <button
                  onClick={() => setStep(2)}
                  className="inline-flex h-12 items-center gap-2 rounded-xl bg-primary px-8 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/25 hover:bg-primary/90"
                >
                  Continue <ChevronRight className="size-4" />
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Payment */}
          {step === 2 && (
            <form
              className="rounded-3xl border border-border bg-card p-6"
              onSubmit={(e) => void onPlaceOrder(e)}
            >
              <h2 className="flex items-center gap-2 text-lg font-bold text-foreground">
                <CreditCard className="size-5 text-primary" /> Payment Method
              </h2>
              <RadioGroupRoot
                className="mt-5 grid gap-3"
                value={paymentMethod}
                onValueChange={(v) => setPaymentMethod(String(v))}
              >
                {PAYMENT_METHODS.map((m) => (
                  <RadioItem
                    key={m.id}
                    value={m.id}
                    label={
                      <div className="flex items-center gap-3">
                        <span className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                          <m.icon className="size-5" />
                        </span>
                        <div>
                          <p className="font-semibold">{m.label}</p>
                          <p className="text-xs text-muted-foreground">{m.sub}</p>
                        </div>
                      </div>
                    }
                  />
                ))}
              </RadioGroupRoot>

              {paymentMethod === 'upi' && (
                <div className="mt-4">
                  <label className="mb-1.5 block text-sm font-medium text-foreground">UPI ID</label>
                  <Input placeholder="yourname@upi" />
                </div>
              )}
              {paymentMethod === 'card' && (
                <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <label className="mb-1.5 block text-sm font-medium text-foreground">
                      Card Number
                    </label>
                    <Input placeholder="0000 0000 0000 0000" inputMode="numeric" />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-foreground">
                      Expiry
                    </label>
                    <Input placeholder="MM/YY" />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-foreground">CVV</label>
                    <Input placeholder="•••" type="password" />
                  </div>
                </div>
              )}
              {paymentMethod === 'cod' && (
                <p className="mt-4 rounded-xl bg-primary/10 px-4 py-3 text-sm text-primary">
                  You'll pay <span className="font-bold">{formatPrice(total)}</span> when your order
                  is delivered. Please keep the exact amount ready.
                </p>
              )}

              <div className="mt-6 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-foreground"
                >
                  <ChevronLeft className="size-4" /> Back
                </button>
                <button
                  type="submit"
                  disabled={processing}
                  className="inline-flex h-12 items-center gap-2 rounded-xl bg-primary px-8 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:bg-primary/90 disabled:opacity-60"
                >
                  {processing ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <Lock className="size-4" />
                  )}
                  {processing ? 'Placing Order…' : `Pay ${formatPrice(total)}`}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Order summary */}
        <div className="h-fit lg:sticky lg:top-28">
          <div className="rounded-3xl border border-border bg-card p-6">
            <h2 className="text-lg font-bold text-foreground">Order Summary</h2>
            <div className="mt-4 max-h-64 space-y-3 overflow-y-auto pr-1">
              {summary.map((item) => (
                <div key={item.id} className="flex items-center gap-3">
                  <div className="relative shrink-0">
                    <div className="flex size-14 items-center justify-center overflow-hidden rounded-xl border border-border bg-background">
                      <ProductImage
                        src={item.product.thumbnail || item.product.images?.[0]}
                        alt={item.product.title}
                        category="general"
                        className="h-full w-full"
                      />
                    </div>
                    <span className="absolute -right-1.5 -top-1.5 flex size-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                      {item.quantity}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm text-foreground">{item.product.title}</p>
                    <p className="text-xs text-muted-foreground">{formatPrice(item.unit)} each</p>
                  </div>
                  <span className="text-sm font-semibold text-foreground">
                    {formatPrice(item.lineTotal)}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-5 space-y-2.5 border-t border-border pt-4 text-sm">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal ({itemCount} items)</span>
                <span className="font-medium text-foreground">{formatPrice(subtotal)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-muted-foreground">
                  <span>Discount</span>
                  <span className="font-semibold text-success">- {formatPrice(discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-muted-foreground">
                <span>Delivery</span>
                <span
                  className={
                    deliveryCharge === 0
                      ? 'font-semibold text-success'
                      : 'font-medium text-foreground'
                  }
                >
                  {deliveryCharge === 0 ? 'FREE' : formatPrice(deliveryCharge)}
                </span>
              </div>
              {expressCharge > 0 && (
                <div className="flex justify-between text-muted-foreground">
                  <span>Express</span>
                  <span className="font-medium text-foreground">{formatPrice(expressCharge)}</span>
                </div>
              )}
              <div className="flex justify-between border-t border-border pt-3 text-base font-bold text-foreground">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>

            <div className="mt-4 flex items-center gap-2 rounded-xl bg-success/10 px-3 py-2.5 text-xs font-medium text-success">
              <ShieldCheck className="size-4 shrink-0" /> 100% secure & encrypted payment
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
