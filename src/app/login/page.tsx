'use client';

import Image from 'next/image';
import { useState } from 'react';
import { LuEye, LuEyeOff, LuLogIn, LuLock, LuMail, LuShieldCheck } from 'react-icons/lu';
import { toast } from 'sonner';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({ email: '', password: '' });
  const [loginError, setLoginError] = useState('');

  const validate = () => {
    const e = { email: '', password: '' };
    if (!email.trim()) e.email = 'Vui lòng nhập email';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) e.email = 'Email không hợp lệ';
    if (!password.trim()) e.password = 'Vui lòng nhập mật khẩu';
    setErrors(e);
    return !e.email && !e.password;
  };

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    setLoginError('');
    if (!validate()) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    setLoading(false);
    if (email.trim().toLowerCase() !== 'srtmientrungimage@gmail.com' || password.trim() !== '123456') {
      setLoginError('Email hoặc mật khẩu không đúng. Vui lòng thử lại.');
      toast.error('Đăng nhập thất bại', { description: 'Email hoặc mật khẩu không đúng.' });
      return;
    }
    document.cookie = 'srt_auth=1; path=/; max-age=86400; SameSite=Lax';
    toast.success('Đăng nhập thành công', { description: 'Đang chuyển hướng...' });
    setTimeout(() => { window.location.href = '/admin'; }, 800);
  };

  const formProps = { email, password, showPassword, loading, errors, loginError, setEmail, setPassword, setShowPassword, onSubmit: handleSubmit };

  return (
    <div className="min-h-screen flex flex-col bg-[#f5eae6]">

      {/* ── DESKTOP ── */}
      <div className="hidden lg:flex flex-1 items-stretch justify-center px-4 bg-[#f5eae6]">
        <div className="flex flex-1 max-w-7xl w-full relative overflow-hidden rounded-2xl my-4 shadow-xl">

          {/* Left panel */}
          <div className="relative flex-1 flex flex-col p-10 overflow-hidden">
            <Image src="/bg-login.webp" alt="" fill className="object-cover object-center" priority />
            <div className="absolute inset-0 bg-linear-to-b from-white/60 via-white/30 to-white/70" />

            <div className="relative z-10 flex items-center gap-3">
              <Image src="/logo.png" alt="SRT Miền Trung" width={130} height={130} className="object-contain" />
            </div>

            <div className="relative z-10 flex flex-col items-center text-center">
              <h1 className="text-5xl font-bold text-zinc-800 leading-tight mb-4">
                Hệ thống tra cứu<br />
                thông tin <span className="text-primary">căn hộ</span>
              </h1>
              <p className="text-xl font-semibold leading-relaxed">
                Nền tảng tra cứu thông tin căn hộ chính thức<br />
                của <span className="font-semibold text-primary">SRT Miền Trung</span>
              </p>
            </div>
          </div>

          {/* Right panel */}
          <div className="w-[420px] bg-white flex flex-col justify-between p-10">
            <div>
              <h2 className="text-2xl font-bold text-zinc-900 mb-1">Đăng nhập hệ thống</h2>
              <p className="text-sm text-zinc-500 mb-8 leading-relaxed">
                Chào mừng bạn quay trở lại. Vui lòng đăng nhập<br />
                để tiếp tục tra cứu thông tin căn hộ.
              </p>
              <LoginForm {...formProps} showForgot />
            </div>
            <div className="flex flex-col items-center gap-4 mt-8">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-red-50 flex items-center justify-center">
                  <LuShieldCheck className="w-4 h-4 text-primary" />
                </div>
                <p className="text-xs text-zinc-500 leading-tight">
                  Hệ thống tra cứu căn hộ chính thức<br />
                  <span className="font-semibold text-primary">SRT Miền Trung</span>
                </p>
              </div>
              <p className="text-xs text-zinc-400">© 2024 SRT Miền Trung. All rights reserved.</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── MOBILE ── */}
      <div className="lg:hidden flex flex-col items-center justify-between min-h-screen px-6 py-10 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <Image src="/bg-login.webp" alt="" fill className="object-cover object-top opacity-20" priority />
        </div>
        <div />
        <div className="relative z-10 flex flex-col items-center text-center mb-8">
          <Image src="/logo.png" alt="SRT Miền Trung" width={80} height={80} className="w-20 h-20 object-contain mb-3" />
          <h1 className="mt-5 text-2xl font-bold text-zinc-900">Đăng nhập hệ thống</h1>
          <p className="mt-2 text-sm text-zinc-500 max-w-xs leading-relaxed">
            Chào mừng bạn quay trở lại. Vui lòng đăng nhập<br />
            để tiếp tục tra cứu thông tin căn hộ.
          </p>
        </div>
        <div className="relative z-10 w-full max-w-sm bg-white rounded-3xl shadow-lg p-7">
          <LoginForm {...formProps} />
        </div>
        <div className="relative z-10 flex items-center gap-3 mt-8">
          <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center shrink-0">
            <LuShieldCheck className="w-5 h-5 text-primary" />
          </div>
          <p className="text-sm text-zinc-500 leading-tight">
            Hệ thống tra cứu căn hộ chính thức<br />
            <span className="font-semibold text-primary">SRT Miền Trung</span>
          </p>
        </div>
        <div className="relative z-10 text-center mt-6">
          <p className="text-xs text-zinc-400">© 2024 SRT Miền Trung. All rights reserved.</p>
          <p className="text-xs text-zinc-400 mt-0.5">Phiên bản 1.0.0</p>
        </div>
      </div>
    </div>
  );
}

interface LoginFormProps {
  email: string;
  password: string;
  showPassword: boolean;
  loading: boolean;
  errors: { email: string; password: string };
  loginError: string;
  setEmail: (v: string) => void;
  setPassword: (v: string) => void;
  setShowPassword: (v: boolean) => void;
  onSubmit: (e: React.SyntheticEvent) => void;
  showForgot?: boolean;
}

function LoginForm({ email, password, showPassword, loading, errors, loginError, setEmail, setPassword, setShowPassword, onSubmit, showForgot }: LoginFormProps) {
  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-5">
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-semibold text-zinc-800">Email</label>
        <div className="relative">
          <LuMail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Nhập email của bạn"
            className="w-full h-12 pl-11 pr-4 rounded-xl border border-zinc-200 text-sm text-zinc-800 placeholder:text-zinc-400 bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
          />
        </div>
        {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-semibold text-zinc-800">Mật khẩu</label>
        <div className="relative">
          <LuLock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
          <input
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Nhập mật khẩu"
            className="w-full h-12 pl-11 pr-11 rounded-xl border border-zinc-200 text-sm text-zinc-800 placeholder:text-zinc-400 bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 transition-colors"
          >
            {showPassword ? <LuEyeOff className="w-5 h-5" /> : <LuEye className="w-5 h-5" />}
          </button>
        </div>
        {errors.password && <p className="text-xs text-red-500">{errors.password}</p>}
      </div>

      {showForgot && (
        <div className="flex justify-end">
          <button type="button" className="text-sm font-medium text-primary hover:underline">
            Quên mật khẩu?
          </button>
        </div>
      )}

      {loginError && (
        <p className="text-sm text-red-500 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-center">
          {loginError}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="h-13 w-full flex items-center justify-center gap-2.5 rounded-xl bg-primary text-white font-semibold text-base shadow-md hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-60"
      >
        <LuLogIn className="w-5 h-5" />
        {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
      </button>
    </form>
  );
}
