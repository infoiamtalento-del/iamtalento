import React, { useState } from "react";
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
  ChevronRight,
  ArrowUpRight,
  ArrowDownLeft,
  X,
  Sparkles,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { ProUser, BANKS, WALLETS, UPI_HANDLES, formatINR } from "@/data/proData";
import { ProDrawerState } from "./proTypes";

interface ProWalletViewProps {
  user: ProUser;
  onUpdateWallet: (newBalance: number, newTx: any) => void;
  onOpenDrawer: (drawer: ProDrawerState) => void;
  onToast: (msg: string) => void;
}

export const ProWalletView: React.FC<ProWalletViewProps> = ({
  user,
  onUpdateWallet,
  onOpenDrawer,
  onToast,
}) => {
  const isEmployer = user.role === "employer";
  const walletData = user.wal || { bal: 1500, hist: [] };
  const [balance, setBalance] = useState(walletData.bal || 1500);

  // Payment form state
  const [addAmount, setAddAmount] = useState<number>(1000);
  const [paymentTab, setPaymentTab] = useState<"card" | "upi" | "nb" | "wl">("card");

  // Card fields
  const [cardNumber, setCardNumber] = useState("4111 1111 1111 1111");
  const [cardName, setCardName] = useState(user.name);
  const [cardExpiry, setCardExpiry] = useState("08/29");
  const [cardCvv, setCardCvv] = useState("123");

  // UPI fields
  const [upiId, setUpiId] = useState("vignesh@okhdfcbank");

  // Net banking & wallet
  const [selectedBank, setSelectedBank] = useState("HDFC Bank");
  const [selectedWallet, setSelectedWallet] = useState("PhonePe");

  // OTP Simulation Modal
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpValue, setOtpValue] = useState("");
  const [otpStep, setOtpStep] = useState<"input" | "processing" | "success">("input");
  const [pendingTx, setPendingTx] = useState<any>(null);

  // Sample service offerings
  const serviceOfferings = isEmployer
    ? [
        { title: "Recruiter Credits (100 pack)", price: 2499, desc: "Unlock direct candidate phone/email access" },
        { title: "Job Spotlight Boost (7 days)", price: 999, desc: "Pin job listing to top of candidate search" },
        { title: "AI Candidate Shortlisting", price: 499, desc: "Autonomous AI ranking of incoming applicants" },
      ]
    : [
        { title: "Profile Priority Spotlight", price: 499, desc: "Featured at top of employer search for 14 days" },
        { title: "Proctored Mock Interview & Feedback", price: 799, desc: "1-on-1 technical mock interview with detailed rubric" },
        { title: "Resume ATS Deep Scan", price: 299, desc: "Comprehensive ATS parser benchmark against 50+ portals" },
      ];

  const handleStartPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (addAmount < 10) {
      onToast("Minimum amount to add is ₹10");
      return;
    }

    if (cardNumber.replace(/\s/g, "") === "4000000000000002") {
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
      via: paymentTab === "card" ? "Credit/Debit Card" : paymentTab === "upi" ? "UPI Instant" : paymentTab === "nb" ? selectedBank : selectedWallet,
    };

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

    const txId = "TXN-" + Math.floor(100000 + Math.random() * 900000);
    const tx = {
      id: txId,
      desc: service.title,
      amt: service.price,
      type: "debit",
      at: Date.now(),
      st: "Success",
      via: "Wallet Balance",
    };

    const newBal = balance - service.price;
    setBalance(newBal);
    onUpdateWallet(newBal, tx);
    onToast(`Purchased "${service.title}"! Transaction ID: ${txId}`);
  };

  const transactions = walletData.hist || [];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-card border border-border/80 rounded-2xl p-6 relative overflow-hidden shadow-sm">
        <div className="absolute top-0 right-0 w-72 h-72 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-2">
              <Wallet className="w-3.5 h-3.5" /> Talento Wallet Hub
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground font-display">
              Wallet & Payments
            </h1>
            <p className="text-muted-foreground text-sm mt-1 max-w-2xl">
              Add funds securely via Card, UPI, Net Banking or mobile wallets to purchase recruiter credits, profile boosts, or skill certifications.
            </p>
          </div>
          <div className="text-right shrink-0">
            <span className="text-xs text-muted-foreground block">Available Balance</span>
            <div className="text-3xl font-bold text-foreground font-display">{formatINR(balance)}</div>
          </div>
        </div>
      </div>

      {/* Main Grid: Add Money & Services */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Form: Add Money (7 cols) */}
        <div className="lg:col-span-7 bg-card border border-border/80 rounded-2xl p-5 shadow-sm space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-foreground text-base flex items-center gap-2">
              <Plus className="w-4 h-4 text-primary" /> Add Money to Wallet
            </h3>
            <span className="text-xs text-muted-foreground">Instant processing</span>
          </div>

          <form onSubmit={handleStartPayment} className="space-y-4">
            {/* Amount Selection */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-foreground block">Amount (₹10 to ₹1,00,000)</label>
              <Input
                type="number"
                min="10"
                max="100000"
                value={addAmount}
                onChange={(e) => setAddAmount(Number(e.target.value))}
                className="text-base font-bold"
                required
              />

              <div className="flex items-center gap-2 pt-1 flex-wrap">
                {[500, 1000, 2000, 5000].map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setAddAmount(amt)}
                    className={cn(
                      "px-3 py-1 rounded-lg text-xs font-semibold border transition-colors",
                      addAmount === amt
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-muted/40 text-muted-foreground border-border/60 hover:text-foreground"
                    )}
                  >
                    + ₹{amt}
                  </button>
                ))}
              </div>
            </div>

            {/* Payment Method Tabs */}
            <div className="space-y-2 pt-2">
              <label className="text-xs font-medium text-foreground block">Choose Payment Method</label>
              <div className="grid grid-cols-4 gap-2">
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
                      "p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all text-xs font-semibold",
                      paymentTab === id
                        ? "border-primary bg-primary/5 text-primary shadow-sm"
                        : "border-border/80 bg-background text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Specific Inputs */}
            {paymentTab === "card" && (
              <div className="space-y-3 pt-2 text-xs">
                <div>
                  <label className="font-medium text-foreground block mb-1">Card Number</label>
                  <Input
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    placeholder="4111 1111 1111 1111"
                    maxLength={19}
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-medium text-foreground block mb-1">Cardholder Name</label>
                    <Input
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="font-medium text-foreground block mb-1">Expiry (MM/YY)</label>
                    <Input
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      placeholder="MM/YY"
                      maxLength={5}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-medium text-foreground block mb-1">CVV</label>
                    <Input
                      type="password"
                      maxLength={4}
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value)}
                      placeholder="•••"
                    />
                  </div>
                  <div className="flex items-end">
                    <span className="text-[11px] text-muted-foreground pb-2">
                      Demo OTP: <b>123456</b>
                    </span>
                  </div>
                </div>
              </div>
            )}

            {paymentTab === "upi" && (
              <div className="space-y-3 pt-2 text-xs">
                <div>
                  <label className="font-medium text-foreground block mb-1">UPI ID / VPA</label>
                  <Input
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    placeholder="username@okhdfcbank"
                  />
                </div>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {UPI_HANDLES.map(([name, handle]) => (
                    <button
                      key={handle}
                      type="button"
                      onClick={() => setUpiId(`user${handle}`)}
                      className="px-2 py-1 rounded-md bg-muted text-[11px] font-medium text-foreground hover:bg-primary/10 hover:text-primary transition-colors border border-border/60"
                    >
                      {name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {paymentTab === "nb" && (
              <div className="space-y-3 pt-2 text-xs">
                <div>
                  <label className="font-medium text-foreground block mb-1">Select Bank</label>
                  <select
                    value={selectedBank}
                    onChange={(e) => setSelectedBank(e.target.value)}
                    className="w-full h-9 rounded-xl border border-input bg-background px-3 py-1 text-xs shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  >
                    {BANKS.map((b) => (
                      <option key={b}>{b}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {paymentTab === "wl" && (
              <div className="space-y-3 pt-2 text-xs">
                <label className="font-medium text-foreground block">Select Mobile Wallet</label>
                <div className="grid grid-cols-2 gap-2">
                  {WALLETS.map((w) => (
                    <button
                      key={w}
                      type="button"
                      onClick={() => setSelectedWallet(w)}
                      className={cn(
                        "p-3 rounded-xl border text-xs font-semibold text-center transition-colors",
                        selectedWallet === w
                          ? "border-primary bg-primary/5 text-primary"
                          : "border-border/80 bg-background text-muted-foreground hover:text-foreground"
                      )}
                    >
                      {w}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <Button type="submit" className="w-full rounded-xl gap-2 font-medium shadow-sm">
              <Lock className="w-4 h-4" /> Pay {formatINR(addAmount)} Securely
            </Button>
          </form>
        </div>

        {/* Right Column: Portal Services & Balance Usage (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          <div className="bg-card border border-border/80 rounded-2xl p-5 shadow-sm space-y-4">
            <div>
              <h3 className="font-semibold text-foreground text-base flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary" /> Use Your Balance
              </h3>
              <p className="text-xs text-muted-foreground">One-click activation using your current wallet funds</p>
            </div>

            <div className="space-y-3">
              {serviceOfferings.map((service, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl border border-border/60 bg-muted/20 flex flex-col justify-between gap-2"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="font-bold text-foreground text-xs">{service.title}</div>
                      <div className="text-[11px] text-muted-foreground mt-0.5">{service.desc}</div>
                    </div>
                    <span className="font-bold text-foreground text-sm shrink-0">
                      {formatINR(service.price)}
                    </span>
                  </div>
                  <div className="flex justify-end pt-1">
                    <Button
                      size="sm"
                      onClick={() => handleSpendBalance(service)}
                      className="rounded-lg text-xs h-7 px-3 gap-1"
                    >
                      <Zap className="w-3 h-3" /> Activate
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Security Guarantee Card */}
          <div className="bg-card border border-border/80 rounded-2xl p-4 shadow-sm flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
            <div className="text-xs space-y-1">
              <div className="font-semibold text-foreground">Safe & Encrypted Transactions</div>
              <p className="text-muted-foreground text-[11px] leading-relaxed">
                Full payment credentials and card numbers are never stored in plain text. Transactions are authenticated using 256-bit SSL encryption.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Transactions History Table */}
      <div className="bg-card border border-border/80 rounded-2xl p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-foreground text-base flex items-center gap-2">
            <FileText className="w-4 h-4 text-primary" /> Recent Transactions ({transactions.length})
          </h3>
        </div>

        <div className="divide-y divide-border/60">
          {transactions.length === 0 ? (
            <p className="py-6 text-center text-xs text-muted-foreground">
              No transactions recorded yet. Add money or purchase services to view history here.
            </p>
          ) : (
            transactions.map((tx: any, idx: number) => {
              const isCredit = tx.type === "credit";
              return (
                <div
                  key={idx}
                  className="py-3 flex items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        "w-9 h-9 rounded-xl flex items-center justify-center shrink-0",
                        isCredit
                          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                          : "bg-primary/10 text-primary"
                      )}
                    >
                      {isCredit ? <ArrowDownLeft className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                    </div>
                    <div>
                      <div className="font-semibold text-foreground">{tx.desc}</div>
                      <div className="text-muted-foreground text-[11px]">
                        {new Date(tx.at).toLocaleDateString()} • {tx.via || "Card"}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-right">
                    <span
                      className={cn(
                        "font-bold text-sm",
                        isCredit ? "text-emerald-600 dark:text-emerald-400" : "text-foreground"
                      )}
                    >
                      {isCredit ? "+" : "−"} {formatINR(tx.amt)}
                    </span>
                    <Button
                      size="sm"
                      variant="outline"
                      className="rounded-lg text-xs h-7 px-2.5 bg-background"
                      onClick={() => onOpenDrawer({ type: "receipt", txId: tx.id || `TXN-${idx}` })}
                    >
                      Receipt
                    </Button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Demo OTP Modal */}
      {showOtpModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card border border-border/80 rounded-2xl p-6 max-w-sm w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-foreground text-base flex items-center gap-2">
                <Lock className="w-4 h-4 text-primary" /> Bank Authentication
              </h3>
              <button
                onClick={() => setShowOtpModal(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {otpStep === "input" && (
              <div className="space-y-4 text-xs">
                <p className="text-muted-foreground">
                  A demo 6-digit one-time password has been simulated for your bank payment. Enter <b>123456</b> to authorize:
                </p>
                <div>
                  <label className="font-medium text-foreground block mb-1">Enter OTP</label>
                  <Input
                    maxLength={6}
                    placeholder="123456"
                    value={otpValue}
                    onChange={(e) => setOtpValue(e.target.value)}
                    className="text-center font-bold tracking-widest text-lg h-11"
                  />
                </div>
                <Button
                  onClick={handleConfirmOtp}
                  className="w-full rounded-xl font-medium"
                >
                  Verify & Pay {formatINR(pendingTx?.amt || 0)}
                </Button>
              </div>
            )}

            {otpStep === "processing" && (
              <div className="py-8 text-center space-y-3">
                <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin mx-auto" />
                <div className="font-medium text-foreground text-xs">Authenticating with payment gateway...</div>
              </div>
            )}

            {otpStep === "success" && (
              <div className="py-6 text-center space-y-2">
                <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto animate-bounce" />
                <div className="font-bold text-foreground text-sm">Payment Successful!</div>
                <div className="text-xs text-muted-foreground">Wallet funds updated.</div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
