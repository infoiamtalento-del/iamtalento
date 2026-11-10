import React, { useEffect, useState } from "react";
import {
  Wallet,
  CreditCard,
  Smartphone,
  Landmark,
  ShieldCheck,
  Plus,
  Lock,
  CheckCircle2,
  FileText,
  X,
  Check,
  User,
  Calendar,
  Rocket,
  ReceiptText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { ProUser, BANKS, WALLETS, UPI_HANDLES, formatINR } from "@/data/proData";
import { ProHero } from "./ProHero";
import { ProDrawerState } from "./proTypes";

interface ProWalletViewProps {
  user: ProUser;
  onUpdateWallet: (newBalance: number, newTx: any) => void;
  /** Present only for signed-in candidates: real Razorpay checkout + server ledger. */
  onLiveTopUp?: (amount: number) => Promise<void>;
  onLiveSpend?: (serviceKey: string, title: string) => Promise<void>;
  onOpenDrawer: (drawer: ProDrawerState) => void;
  onToast: (msg: string) => void;
}

interface SavedMethod {
  id: string;
  kind: "card" | "upi";
  label: string;
  sub: string;
  def?: boolean;
}

const cardBrand = (num: string) => {
  const d = num.replace(/\s/g, "");
  if (d.startsWith("4")) return "Visa";
  if (/^(5[1-5]|2[2-7])/.test(d)) return "Mastercard";
  if (/^3[47]/.test(d)) return "Amex";
  if (/^(60|65|81|82|508)/.test(d)) return "RuPay";
  return "Card";
};

const fieldLabel = "mb-1 block text-[11px] font-medium text-muted-foreground";
const iconInput = "h-10 rounded-xl pl-9 text-sm";
const QUICK_AMOUNTS = [500, 1000, 2000, 5000];

export const ProWalletView: React.FC<ProWalletViewProps> = ({
  user,
  onUpdateWallet,
  onLiveTopUp,
  onLiveSpend,
  onOpenDrawer,
  onToast,
}) => {
  const isEmployer = user.role === "employer";
  const walletData = user.wal || { bal: 1500, hist: [] };
  const [balance, setBalance] = useState(onLiveTopUp ? walletData.bal || 0 : walletData.bal || 1500);
  const [liveBusy, setLiveBusy] = useState(false);
  useEffect(() => {
    if (onLiveTopUp) setBalance(walletData.bal || 0);
  }, [onLiveTopUp, walletData.bal]);

  // Payment form state
  const [addAmount, setAddAmount] = useState<number>(0);
  const [paymentTab, setPaymentTab] = useState<"card" | "upi" | "nb" | "wl">("card");

  // Card fields
  const [cardNumber, setCardNumber] = useState("4111 1111 1111 1111");
  const [cardName, setCardName] = useState(user.name.split(" ")[0]);
  const [cardExpiry, setCardExpiry] = useState("08/29");
  const [cardCvv, setCardCvv] = useState("123");
  const [cardType, setCardType] = useState("Credit card");
  const [saveCard, setSaveCard] = useState(true);

  // UPI fields
  const [upiId, setUpiId] = useState("yogesh@okaxis");

  // Net banking & wallet
  const [selectedBank, setSelectedBank] = useState("HDFC Bank");
  const [selectedWallet, setSelectedWallet] = useState("PhonePe");

  // Saved payment methods
  const [savedMethods, setSavedMethods] = useState<SavedMethod[]>([
    { id: "pm-card-4242", kind: "card", label: "Visa ••4242", sub: "Credit card · expires 08/29", def: true },
    { id: "pm-upi-okaxis", kind: "upi", label: "yogesh@okaxis", sub: "UPI ID" },
  ]);
  const [managing, setManaging] = useState(false);

  // OTP Simulation Modal
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpValue, setOtpValue] = useState("");
  const [otpStep, setOtpStep] = useState<"input" | "processing" | "success">("input");
  const [pendingTx, setPendingTx] = useState<any>(null);
  const [pendingSave, setPendingSave] = useState<SavedMethod | null>(null);

  // Sample service offerings
  const serviceOfferings = isEmployer
    ? [
        { key: "recruiter_pack", title: "Recruiter credits (100 pack)", price: 2499, desc: "Unlock direct candidate contact access" },
        { key: "job_spotlight", title: "Job spotlight boost (7 days)", price: 999, desc: "Pin a job to the top of candidate search" },
        { key: "ai_shortlisting", title: "AI candidate shortlisting", price: 499, desc: "Automatic ranking of incoming applicants" },
      ]
    : [
        { key: "profile_boost", title: "Profile boost (7 days)", price: 99, desc: "Featured in employer search" },
        { key: "resume_review", title: "Expert resume review", price: 149, desc: "Feedback from a hiring specialist" },
      ];

  const handleStartPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (addAmount < 10) {
      onToast("Minimum amount to add is ₹10");
      return;
    }

    if (onLiveTopUp) {
      setLiveBusy(true);
      onLiveTopUp(addAmount).finally(() => {
        setLiveBusy(false);
        setAddAmount(0);
      });
      return;
    }

    if (cardNumber.replace(/\s/g, "") === "4000000000000002" && paymentTab === "card") {
      onToast("Test card declined: Insufficient funds or invalid card.");
      return;
    }

    const txId = "TXN-" + Math.floor(100000 + Math.random() * 900000);
    const tx = {
      id: txId,
      desc: `Wallet Top-Up via ${paymentTab.toUpperCase()}`,
      amt: addAmount,
      type: "credit",
      at: Date.now(),
      st: "Success",
      via:
        paymentTab === "card"
          ? `${cardBrand(cardNumber)} ••${cardNumber.replace(/\s/g, "").slice(-4)}`
          : paymentTab === "upi"
          ? `UPI · ${upiId}`
          : paymentTab === "nb"
          ? selectedBank
          : selectedWallet,
    };

    // Only brand + last 4 digits are ever kept
    const digits = cardNumber.replace(/\s/g, "");
    setPendingSave(
      paymentTab === "card" && saveCard && digits.length >= 4
        ? {
            id: `pm-card-${digits.slice(-4)}`,
            kind: "card",
            label: `${cardBrand(cardNumber)} ••${digits.slice(-4)}`,
            sub: `${cardType} · expires ${cardExpiry}`,
          }
        : null
    );
    setPendingTx(tx);
    setShowOtpModal(true);
    setOtpStep("input");
    setOtpValue("");
  };

  const handleConfirmOtp = () => {
    if (otpValue !== "123456" && otpValue.length < 6) {
      onToast("Demo OTP is 123456");
      return;
    }

    setOtpStep("processing");
    setTimeout(() => {
      setOtpStep("success");
      const newBal = balance + (pendingTx?.amt || 0);
      setBalance(newBal);
      onUpdateWallet(newBal, pendingTx);
      if (pendingSave) {
        setSavedMethods((prev) =>
          prev.some((m) => m.id === pendingSave.id) ? prev : [...prev, pendingSave]
        );
      }

      setTimeout(() => {
        setShowOtpModal(false);
        onToast(`Added ₹${pendingTx?.amt} successfully to your wallet!`);
      }, 1000);
    }, 1200);
  };

  const handleSpendBalance = (service: (typeof serviceOfferings)[0]) => {
    if (balance < service.price) {
      onToast(`Insufficient balance. Please add at least ₹${service.price - balance} to proceed.`);
      return;
    }

    if (onLiveSpend) {
      setLiveBusy(true);
      onLiveSpend(service.key, service.title).finally(() => setLiveBusy(false));
      return;
    }

    const txId = "TXN-" + Math.floor(100000 + Math.random() * 900000);
    const tx = {
      id: txId,
      desc: service.title,
      amt: service.price,
      type: "debit",
      at: Date.now(),
      st: "Success",
      via: "Wallet balance",
    };

    const newBal = balance - service.price;
    setBalance(newBal);
    onUpdateWallet(newBal, tx);
    onToast(`Purchased "${service.title}"! Transaction ID: ${txId}`);
  };

  const removeMethod = (id: string) => {
    const next = savedMethods.filter((m) => m.id !== id);
    if (next.length && !next.some((m) => m.def)) next[0] = { ...next[0], def: true };
    setSavedMethods(next);
  };

  const applySavedMethod = (m: SavedMethod) => {
    if (managing) return;
    if (m.kind === "upi") {
      setPaymentTab("upi");
      setUpiId(m.label);
    } else {
      setPaymentTab("card");
    }
  };

  const transactions: any[] = (walletData as any).hist || [];

  const tile = "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary";

  return (
    <div className="space-y-5">
      {/* Hero + security note */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[3fr_2fr]">
        <ProHero
          icon={<Wallet />}
          title="Wallet"
          subtitle="Add money with a Card, UPI, Net Banking or a mobile wallet and use your balance inside the portal."
          aside={
            <span
              aria-hidden
              className="hidden h-28 w-28 items-center justify-center rounded-3xl bg-white/15 ring-1 ring-white/30 sm:flex"
            >
              <Wallet className="h-14 w-14 text-white/90" />
            </span>
          }
        >
          <div className="space-y-2.5 pt-1">
            <div>
              <div className="text-[11px] font-medium text-white/85">Available balance</div>
              <div className="font-display text-4xl font-extrabold leading-tight text-white">
                {formatINR(balance)}
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {QUICK_AMOUNTS.map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => setAddAmount(amt)}
                  className={cn(
                    "rounded-full px-3.5 py-1.5 text-xs font-semibold text-white ring-1 ring-white/35 backdrop-blur-sm transition-colors",
                    addAmount === amt ? "bg-white/30" : "bg-white/12 hover:bg-white/25"
                  )}
                >
                  {formatINR(amt)}
                </button>
              ))}
            </div>
          </div>
        </ProHero>

        <section className="relative flex flex-col justify-center gap-3 overflow-hidden rounded-2xl border border-primary/20 bg-primary/5 p-5">
          <h2 className="flex items-center gap-2 font-display text-sm font-bold text-foreground">
            <ShieldCheck className="h-4 w-4 text-primary" /> Safe &amp; Secure
          </h2>
          <ul className="max-w-[16rem] space-y-2 text-xs text-muted-foreground sm:max-w-[20rem]">
            {[
              "Full card numbers and CVV are never stored",
              "Only brand + last 4 digits are saved as a payment method",
              "This build simulates payments. Connect Razorpay / Cashfree for real money",
            ].map((t) => (
              <li key={t} className="flex items-start gap-2">
                <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
                <span>{t}</span>
              </li>
            ))}
          </ul>
          <ShieldCheck
            aria-hidden
            className="pointer-events-none absolute -bottom-3 right-4 h-24 w-24 text-primary/20"
          />
        </section>
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-2">
        {/* Add money */}
        <div className="space-y-4 rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <Plus className="h-4 w-4" />
            </span>
            <h3 className="font-display text-base font-semibold text-foreground">Add Money to Wallet</h3>
          </div>

          <form onSubmit={handleStartPayment} className="space-y-4">
            <div>
              <label className={fieldLabel}>Amount (₹10 to ₹1,00,000)</label>
              <div className="relative">
                <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                  ₹
                </span>
                <Input
                  type="number"
                  min="10"
                  max="100000"
                  value={addAmount || ""}
                  placeholder="Enter amount"
                  onChange={(e) => setAddAmount(Number(e.target.value))}
                  className="h-10 rounded-xl pl-8 text-sm"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {[
                { id: "card", label: "Card", icon: CreditCard },
                { id: "upi", label: "UPI", icon: Smartphone },
                { id: "nb", label: "Net Banking", icon: Landmark },
                { id: "wl", label: "Wallets", icon: Wallet },
              ].map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setPaymentTab(id as any)}
                  className={cn(
                    "flex h-10 items-center justify-center gap-1.5 rounded-xl border text-xs font-semibold transition-colors",
                    paymentTab === id
                      ? "border-primary bg-primary text-primary-foreground shadow-sm shadow-primary/30"
                      : "border-border bg-background text-foreground hover:border-primary/40"
                  )}
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span>{label}</span>
                </button>
              ))}
            </div>

            {paymentTab === "card" && (
              <div className="space-y-3">
                <div>
                  <label className={fieldLabel}>Card number</label>
                  <div className="relative">
                    <CreditCard className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      placeholder="4111 1111 1111 1111"
                      maxLength={19}
                      className={iconInput}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div>
                    <label className={fieldLabel}>Name on card</label>
                    <div className="relative">
                      <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input value={cardName} onChange={(e) => setCardName(e.target.value)} className={iconInput} />
                    </div>
                  </div>
                  <div>
                    <label className={fieldLabel}>Expiry (MM/YY)</label>
                    <div className="relative">
                      <Calendar className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        placeholder="MM/YY"
                        maxLength={5}
                        className={iconInput}
                      />
                    </div>
                  </div>
                  <div>
                    <label className={fieldLabel}>CVV</label>
                    <div className="relative">
                      <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        type="password"
                        maxLength={4}
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                        placeholder="•••"
                        className={iconInput}
                      />
                    </div>
                  </div>
                  <div>
                    <label className={fieldLabel}>Card type</label>
                    <div className="relative">
                      <CreditCard className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <select
                        value={cardType}
                        onChange={(e) => setCardType(e.target.value)}
                        className="h-10 w-full rounded-xl border border-input bg-background pl-9 pr-3 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                      >
                        <option>Credit card</option>
                        <option>Debit card</option>
                      </select>
                    </div>
                  </div>
                </div>
                <label className="flex cursor-pointer items-center gap-2 text-xs text-foreground">
                  <input
                    type="checkbox"
                    checked={saveCard}
                    onChange={(e) => setSaveCard(e.target.checked)}
                    className="h-3.5 w-3.5 accent-blue-600"
                  />
                  Save this card (only brand and last 4 digits are kept)
                </label>
                <p className="text-[11px] leading-relaxed text-muted-foreground">
                  Accepts Visa, Mastercard, RuPay and Amex. Test card: 4111 1111 1111 1111 (succeeds) or 4000 0000
                  0000 0002 (declined). Any future date and any CVV. OTP is 123456.
                </p>
              </div>
            )}

            {paymentTab === "upi" && (
              <div className="space-y-3">
                <div>
                  <label className={fieldLabel}>UPI ID / VPA</label>
                  <Input
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    placeholder="username@okaxis"
                    className="h-10 rounded-xl text-sm"
                  />
                </div>
                <div className="flex flex-wrap items-center gap-1.5">
                  {UPI_HANDLES.map(([name, handle]) => (
                    <button
                      key={handle}
                      type="button"
                      onClick={() => setUpiId(`user${handle}`)}
                      className="rounded-full border border-border bg-background px-3 py-1 text-[11px] font-medium text-foreground transition-colors hover:border-primary/40 hover:bg-primary/10 hover:text-primary"
                    >
                      {name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {paymentTab === "nb" && (
              <div>
                <label className={fieldLabel}>Select bank</label>
                <select
                  value={selectedBank}
                  onChange={(e) => setSelectedBank(e.target.value)}
                  className="h-10 w-full rounded-xl border border-input bg-background px-3 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                >
                  {BANKS.map((b) => (
                    <option key={b}>{b}</option>
                  ))}
                </select>
              </div>
            )}

            {paymentTab === "wl" && (
              <div className="space-y-2">
                <label className={fieldLabel}>Select mobile wallet</label>
                <div className="grid grid-cols-2 gap-2">
                  {WALLETS.map((w) => (
                    <button
                      key={w}
                      type="button"
                      onClick={() => setSelectedWallet(w)}
                      className={cn(
                        "rounded-xl border p-2.5 text-center text-xs font-semibold transition-colors",
                        selectedWallet === w
                          ? "border-primary bg-primary/5 text-primary"
                          : "border-border bg-background text-muted-foreground hover:text-foreground"
                      )}
                    >
                      {w}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <Button
              type="submit"
              disabled={liveBusy}
              className="h-11 w-full gap-2 rounded-xl font-semibold shadow-md shadow-primary/30"
            >
              <Lock className="h-4 w-4" /> {addAmount >= 10 ? `Pay ${formatINR(addAmount)} securely` : "Pay securely"}
            </Button>
          </form>
        </div>

        {/* Right column */}
        <div className="space-y-5">
          {/* Saved payment methods + balance usage */}
          <div className="space-y-4 rounded-2xl border border-border bg-card p-5 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className={tile}>
                  <CreditCard className="h-4 w-4" />
                </span>
                <h3 className="font-display text-sm font-semibold text-foreground">Saved payment methods</h3>
              </div>
              <button
                type="button"
                onClick={() => setManaging((v) => !v)}
                className="text-xs font-semibold text-primary hover:underline"
              >
                {managing ? "Done" : "Manage"}
              </button>
            </div>

            <div className="divide-y divide-border">
              {savedMethods.length === 0 && (
                <p className="py-3 text-xs text-muted-foreground">
                  No saved methods yet. Tick &quot;Save this card&quot; when paying by card.
                </p>
              )}
              {savedMethods.map((m) => (
                <div key={m.id} className="flex items-center justify-between gap-3 py-2.5">
                  <button
                    type="button"
                    onClick={() => applySavedMethod(m)}
                    className="flex min-w-0 flex-1 items-center gap-3 text-left"
                  >
                    <span className={tile}>
                      {m.kind === "card" ? <CreditCard className="h-4 w-4" /> : <Smartphone className="h-4 w-4" />}
                    </span>
                    <span className="min-w-0">
                      <span className="flex items-center gap-2 text-sm font-semibold text-foreground">
                        <span className="truncate">{m.label}</span>
                        {m.def && (
                          <span className="rounded-full bg-primary/10 px-1.5 py-0.5 text-[10px] font-semibold text-primary">
                            Default
                          </span>
                        )}
                      </span>
                      <span className="block truncate text-[11px] text-muted-foreground">{m.sub}</span>
                    </span>
                  </button>
                  {managing && (
                    <button
                      type="button"
                      aria-label={`Remove ${m.label}`}
                      onClick={() => removeMethod(m.id)}
                      className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground hover:bg-primary/10 hover:text-primary"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            <div className="space-y-1 border-t border-border pt-4">
              <div className="flex items-center gap-3 pb-2">
                <span className={tile}>
                  <Wallet className="h-4 w-4" />
                </span>
                <div>
                  <h4 className="font-display text-sm font-semibold text-foreground">Use your balance</h4>
                  <p className="text-[11px] text-muted-foreground">Sample prices for this demo</p>
                </div>
              </div>
              <div className="divide-y divide-border">
                {serviceOfferings.map((service) => (
                  <div key={service.title} className="flex items-center justify-between gap-3 py-2.5">
                    <div className="flex min-w-0 items-center gap-3">
                      <span className={tile}>
                        <Rocket className="h-4 w-4" />
                      </span>
                      <div className="min-w-0">
                        <div className="truncate text-sm text-foreground">{service.title}</div>
                        <div className="truncate text-[11px] text-muted-foreground">{service.desc}</div>
                      </div>
                    </div>
                    <div className="flex shrink-0 items-center gap-3">
                      <span className="text-sm font-bold text-foreground">{formatINR(service.price)}</span>
                      <Button
                        size="sm"
                        onClick={() => handleSpendBalance(service)}
                        className="h-7 rounded-lg px-3 text-xs font-semibold"
                      >
                        Pay
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent transactions */}
          <div className="space-y-3 rounded-2xl border border-border bg-card p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <span className={tile}>
                <FileText className="h-4 w-4" />
              </span>
              <h3 className="font-display text-sm font-semibold text-foreground">Recent Transactions</h3>
            </div>

            {transactions.length === 0 ? (
              <p className="py-6 text-center text-xs text-muted-foreground">
                No transactions recorded yet. Add money or purchase services to view history here.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[26rem] text-left text-xs">
                  <thead>
                    <tr className="border-b border-border text-[11px] font-medium text-muted-foreground">
                      <th className="py-2 pr-3 font-medium">Date</th>
                      <th className="py-2 pr-3 font-medium">Description</th>
                      <th className="py-2 pr-3 font-medium">Amount</th>
                      <th className="py-2 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map((tx: any, idx: number) => {
                      const isCredit = tx.type === "credit";
                      const when = new Date(tx.at);
                      return (
                        <tr
                          key={tx.id || idx}
                          tabIndex={0}
                          role="button"
                          onClick={() => onOpenDrawer({ type: "receipt", txId: tx.id || `TXN-${idx}` })}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              e.preventDefault();
                              onOpenDrawer({ type: "receipt", txId: tx.id || `TXN-${idx}` });
                            }
                          }}
                          className="cursor-pointer border-b border-border/60 transition-colors last:border-0 hover:bg-muted/40 focus-visible:bg-muted/40 focus-visible:outline-none"
                        >
                          <td className="py-2.5 pr-3 align-top">
                            <div className="font-medium text-foreground">
                              {when.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
                            </div>
                            <div className="text-[10px] text-muted-foreground">
                              {when.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
                            </div>
                          </td>
                          <td className="py-2.5 pr-3 align-top">
                            <div className="font-medium text-foreground">{tx.desc}</div>
                            <div className="text-[10px] text-muted-foreground">{tx.via || "Card"}</div>
                          </td>
                          <td
                            className={cn(
                              "whitespace-nowrap py-2.5 pr-3 align-top font-bold",
                              isCredit ? "text-emerald-600 dark:text-emerald-400" : "text-primary"
                            )}
                          >
                            {isCredit ? "+" : "−"} {formatINR(tx.amt)}
                          </td>
                          <td className="py-2.5 align-top">
                            <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 dark:text-emerald-400">
                              {tx.st || "Success"}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
            <p className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
              <ReceiptText className="h-3 w-3" /> Tap a transaction to view or download its receipt.
            </p>
          </div>
        </div>
      </div>

      {/* Demo OTP Modal */}
      {showOtpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm space-y-4 rounded-2xl border border-border bg-card p-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="flex items-center gap-2 font-display text-base font-bold text-foreground">
                <Lock className="h-4 w-4 text-primary" /> Bank Authentication
              </h3>
              <button
                onClick={() => setShowOtpModal(false)}
                aria-label="Close"
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {otpStep === "input" && (
              <div className="space-y-4 text-xs">
                <p className="text-muted-foreground">
                  A demo 6-digit one-time password has been simulated for your bank payment. Enter <b>123456</b> to
                  authorize:
                </p>
                <div>
                  <label className="mb-1 block font-medium text-foreground">Enter OTP</label>
                  <Input
                    maxLength={6}
                    placeholder="123456"
                    value={otpValue}
                    onChange={(e) => setOtpValue(e.target.value)}
                    className="h-11 text-center text-lg font-bold tracking-widest"
                  />
                </div>
                <Button onClick={handleConfirmOtp} className="w-full rounded-xl font-medium">
                  Verify &amp; Pay {formatINR(pendingTx?.amt || 0)}
                </Button>
              </div>
            )}

            {otpStep === "processing" && (
              <div className="space-y-3 py-8 text-center">
                <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                <div className="text-xs font-medium text-foreground">Authenticating with payment gateway...</div>
              </div>
            )}

            {otpStep === "success" && (
              <div className="space-y-2 py-6 text-center">
                <CheckCircle2 className="mx-auto h-10 w-10 animate-bounce text-emerald-500" />
                <div className="text-sm font-bold text-foreground">Payment Successful!</div>
                <div className="text-xs text-muted-foreground">Wallet funds updated.</div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
