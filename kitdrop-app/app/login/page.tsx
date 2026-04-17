"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { toast } from "sonner";
import { Eye, EyeOff, ArrowRight, ShieldCheck, Globe, Lock } from "lucide-react";
import AuthCarousel from "@/components/ui/AuthCarousel";
import { sendWelcomeEmail } from "@/lib/email";

export default function LoginPage() {
  const router = useRouter();
  
  // Use a lazy initializer for tab to avoid useEffect cascade rendering
  const [tab, setTab] = useState<"login" | "register">(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      return params.get("tab") === "register" ? "register" : "login";
    }
    return "login";
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Form Fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [address, setAddress] = useState("");
  const [zilla, setZilla] = useState("");
  const [cityVillage, setCityVillage] = useState("");
  const [age, setAge] = useState("");
  const [favClub, setFavClub] = useState("");
  const [phone, setPhone] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Cash on Delivery");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please enter your credentials.");
      return;
    }
    
    setLoading(true);
    
    if (tab === "register") {
      if (!fullName) {
        toast.error("Full Name is required for registration.");
        setLoading(false);
        return;
      }
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email, password, fullName, address, zilla, cityVillage, age, favClub, phone, paymentMethod
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Registration failed.");
        setLoading(false);
        return;
      }
      
      // Trigger free tier EmailJS welcome communication
      await sendWelcomeEmail(email, fullName);

      toast.success("Account created successfully! Logging you in...");
    }

    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    setLoading(false);
    
    if (res?.error) {
      toast.error("Account not found or invalid credentials. Please sign up.");
      setTab("register");
    } else {
      toast.success(`Welcome to the Archive.`);
      // Check if we have a callbackUrl param so we can navigate back to checkout
      const urlParams = new URLSearchParams(window.location.search);
      const callbackUrl = urlParams.get("callbackUrl");
      router.push(callbackUrl || "/account");
    }
  };

  // Simple password strength
  const getStrength = (p: string) => {
    let s = 0;
    if (p.length >= 8) s++;
    if (/[A-Z]/.test(p)) s++;
    if (/[0-9]/.test(p)) s++;
    if (/[^A-Za-z0-9]/.test(p)) s++;
    return s;
  };
  const strength = getStrength(password);
  const strengthLabels = ["Weak", "Fair", "Good", "Secure"];
  const strengthColors = ["bg-error", "bg-orange-500", "bg-yellow-500", "bg-accent"];

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* LEFT — Stadium Visual */}
      <div className="relative w-full lg:w-[55%] min-h-[30vh] sm:min-h-[35vh] lg:min-h-screen bg-surface overflow-hidden">
        {/* Stadium gradient background */}
        <div className="absolute inset-0 stadium-gradient" />
        <div className="absolute inset-0 animate-spotlight opacity-50" />

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-between h-full p-6 sm:p-8 lg:p-12">
          <Link
            href="/"
            className="text-accent font-headline font-black italic text-xl tracking-tighter uppercase"
          >
            KITDROP
          </Link>

          <div className="mt-auto mb-8 lg:mb-0 lg:mt-auto">
            <div className="hidden lg:block mb-12">
              <AuthCarousel />
            </div>
            
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black uppercase font-headline tracking-tight leading-[0.9]">
              Authentic
              <br />
              <span className="text-accent italic">Gear Only.</span>
            </h2>
            <p className="text-on-surface-variant text-base sm:text-lg md:text-xl mt-6 max-w-xl leading-relaxed">
              Access the global archive of premium football kits. From vintage
              legends to modern tech, secure your squad&apos;s legacy.
            </p>

            {/* Stats */}
            <div className="flex gap-6 sm:gap-8 mt-6 sm:mt-8">
              <div>
                <p className="text-accent text-xs uppercase tracking-wider font-headline font-bold">
                  Live Drops
                </p>
                <p className="text-xl sm:text-2xl font-black font-headline">
                  12.4K+
                </p>
              </div>
              <div>
                <p className="text-accent text-xs uppercase tracking-wider font-headline font-bold">
                  Active Members
                </p>
                <p className="text-xl sm:text-2xl font-black font-headline">
                  850K
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT — Auth Form */}
      <div className="w-full lg:w-[45%] flex flex-col bg-background">
        {/* Back link */}
        <div className="flex justify-end p-4 sm:p-5">
          <Link
            href="/"
            className="text-on-surface-variant hover:text-accent text-xs font-headline font-bold uppercase tracking-tight flex items-center gap-1 transition-colors"
          >
            Back to Shop
            <ArrowRight size={14} />
          </Link>
        </div>

        <div className="flex-1 flex items-center justify-center px-6 sm:px-8 lg:px-12 pb-8 sm:pb-12">
          <div className="w-full max-w-md">
            {/* Tabs */}
            <div className="flex gap-6 sm:gap-8 mb-8 sm:mb-10">
              <button
                onClick={() => setTab("login")}
                className={`font-headline font-black uppercase text-xl sm:text-2xl tracking-tight pb-2 border-b-2 transition-colors ${
                  tab === "login"
                    ? "text-on-surface border-accent"
                    : "text-on-surface-variant border-transparent hover:text-on-surface"
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => setTab("register")}
                className={`font-headline font-black uppercase text-xl sm:text-2xl tracking-tight pb-2 border-b-2 transition-colors ${
                  tab === "register"
                    ? "text-on-surface border-accent"
                    : "text-on-surface-variant border-transparent hover:text-on-surface"
                }`}
              >
                Create Account
              </button>
            </div>

            {/* Social Login */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <button 
                type="button" 
                onClick={() => signIn("google", { callbackUrl: "/account" })}
                className="flex items-center justify-center gap-2 py-3 sm:py-3.5 bg-surface border border-border hover:border-border-hover text-on-surface text-sm font-headline font-bold uppercase tracking-tight transition-colors active:scale-[0.98]"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Google
              </button>
              <button 
                type="button" 
                onClick={() => signIn("facebook", { callbackUrl: "/account" })}
                className="flex items-center justify-center gap-2 py-3 sm:py-3.5 bg-surface border border-border hover:border-border-hover text-on-surface text-sm font-headline font-bold uppercase tracking-tight transition-colors active:scale-[0.98]"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                Facebook
              </button>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-4 my-6">
              <div className="flex-1 h-px bg-border" />
              <span className="text-on-surface-variant text-xs tracking-widest uppercase font-headline">
                Or Email Archive
              </span>
              <div className="flex-1 h-px bg-border" />
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
              {tab === "register" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 mb-4 sm:mb-5">
                  <div className="sm:col-span-2">
                    <label htmlFor="fullname" className="block text-[10px] sm:text-xs font-headline font-bold uppercase tracking-widest text-on-surface-variant mb-2">
                      Full Name
                    </label>
                    <input
                      id="fullname"
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full bg-background border border-border px-4 py-3 sm:py-3.5 text-on-surface text-sm focus:outline-none focus:border-accent transition-colors"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label htmlFor="address" className="block text-[10px] sm:text-xs font-headline font-bold uppercase tracking-widest text-on-surface-variant mb-2">
                      Address
                    </label>
                    <input
                      id="address"
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full bg-background border border-border px-4 py-3 sm:py-3.5 text-on-surface text-sm focus:outline-none focus:border-accent transition-colors"
                    />
                  </div>
                  <div>
                    <label htmlFor="zilla" className="block text-[10px] sm:text-xs font-headline font-bold uppercase tracking-widest text-on-surface-variant mb-2">
                      Zilla
                    </label>
                    <input
                      id="zilla"
                      type="text"
                      value={zilla}
                      onChange={(e) => setZilla(e.target.value)}
                      className="w-full bg-background border border-border px-4 py-3 sm:py-3.5 text-on-surface text-sm focus:outline-none focus:border-accent transition-colors"
                    />
                  </div>
                  <div>
                    <label htmlFor="cityVillage" className="block text-[10px] sm:text-xs font-headline font-bold uppercase tracking-widest text-on-surface-variant mb-2">
                      City / Village
                    </label>
                    <input
                      id="cityVillage"
                      type="text"
                      value={cityVillage}
                      onChange={(e) => setCityVillage(e.target.value)}
                      className="w-full bg-background border border-border px-4 py-3 sm:py-3.5 text-on-surface text-sm focus:outline-none focus:border-accent transition-colors"
                    />
                  </div>
                  <div>
                    <label htmlFor="age" className="block text-[10px] sm:text-xs font-headline font-bold uppercase tracking-widest text-on-surface-variant mb-2">
                      Age
                    </label>
                    <input
                      id="age"
                      type="number"
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      className="w-full bg-background border border-border px-4 py-3 sm:py-3.5 text-on-surface text-sm focus:outline-none focus:border-accent transition-colors"
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-[10px] sm:text-xs font-headline font-bold uppercase tracking-widest text-on-surface-variant mb-2">
                      Phone Number
                    </label>
                    <input
                      id="phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-background border border-border px-4 py-3 sm:py-3.5 text-on-surface text-sm focus:outline-none focus:border-accent transition-colors"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label htmlFor="favClub" className="block text-[10px] sm:text-xs font-headline font-bold uppercase tracking-widest text-on-surface-variant mb-2">
                      Favorite Club
                    </label>
                    <input
                      id="favClub"
                      type="text"
                      value={favClub}
                      onChange={(e) => setFavClub(e.target.value)}
                      className="w-full bg-background border border-border px-4 py-3 sm:py-3.5 text-on-surface text-sm focus:outline-none focus:border-accent transition-colors"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label htmlFor="paymentMethod" className="block text-[10px] sm:text-xs font-headline font-bold uppercase tracking-widest text-on-surface-variant mb-2">
                      Preferred Payment Method
                    </label>
                    <select
                      id="paymentMethod"
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-full bg-background border border-border px-4 py-3 sm:py-3.5 text-on-surface text-sm focus:outline-none focus:border-accent transition-colors appearance-none"
                    >
                      <option value="Cash on Delivery">Cash on Delivery</option>
                      <option value="Bkash">Bkash</option>
                      <option value="Nagad">Nagad</option>
                      <option value="Card">Card</option>
                    </select>
                  </div>
                </div>
              )}

              <div className="mb-4 sm:mb-5">
                <label htmlFor="email" className="block text-[10px] sm:text-xs font-headline font-bold uppercase tracking-widest text-on-surface-variant mb-2">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-background border border-border px-4 py-3 sm:py-3.5 text-on-surface text-sm focus:outline-none focus:border-accent transition-colors"
                />
              </div>

              <div className="mb-5 sm:mb-6">
                <label htmlFor="password" className="flex items-center justify-between text-[10px] sm:text-xs font-headline font-bold uppercase tracking-widest text-on-surface-variant mb-2">
                  <span>Tactical Password</span>
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-background border border-border pl-4 pr-12 py-3 sm:py-3.5 text-on-surface text-sm focus:outline-none focus:border-accent transition-colors tracking-widest"
                  />
                  <button
                    type="button"
                    title={showPassword ? "Hide password" : "Show password"}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-accent transition-colors"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>

                {/* Strength Bar */}
                {password.length > 0 && (
                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex-1 flex gap-1">
                      {[0, 1, 2, 3].map((i) => (
                        <div
                          key={i}
                          className={`h-1 flex-1 transition-colors ${
                            i < strength
                              ? strengthColors[strength - 1]
                              : "bg-border"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-on-surface-variant text-[10px] uppercase tracking-wider font-headline">
                      {strength > 0 ? strengthLabels[strength - 1] : ""}
                    </span>
                  </div>
                )}
              </div>

              {/* Remember + Forgot */}
              {tab === "login" && (
                <div className="flex items-center justify-between">
                  <label htmlFor="remember" className="flex items-center gap-2 cursor-pointer">
                    <input
                      id="remember"
                      type="checkbox"
                      className="w-4 h-4 accent-accent"
                    />
                    <span className="text-on-surface-variant text-xs tracking-wider uppercase font-headline">
                      Remember Access
                    </span>
                  </label>
                  <button
                    type="button"
                    className="text-accent text-xs font-headline font-bold uppercase tracking-tight"
                  >
                    Forgot Tactical ID?
                  </button>
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center bg-accent text-on-accent py-4 sm:py-5 font-headline font-bold uppercase tracking-tight text-base sm:text-lg hover:bg-accent-dim transition-colors active:scale-[0.98] mt-4 rounded-lg shadow-lg disabled:opacity-50"
              >
                {loading ? "Processing..." : tab === "login" ? "Initialize Login" : "Create Archive Access"}
              </button>

              <p className="text-on-surface-variant text-[10px] sm:text-xs text-center leading-relaxed mt-4">
                By entering the archive, you agree to our{" "}
                <button className="text-on-surface underline underline-offset-2">
                  Terms of Service
                </button>{" "}
                and{" "}
                <button className="text-on-surface underline underline-offset-2">
                  Privacy Protocol
                </button>
                .
              </p>
            </form>

            {/* Bottom Icons */}
            <div className="flex items-center justify-center gap-4 mt-8 sm:mt-10 text-on-surface-variant/40">
              <ShieldCheck size={18} />
              <Lock size={18} />
              <Globe size={18} />
            </div>

            <p className="text-on-surface-variant/40 text-[10px] text-center mt-3 tracking-wider uppercase font-headline">
              © 2025 KitDrop Global Archive. All Rights Reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
