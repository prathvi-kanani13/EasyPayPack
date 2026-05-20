import { useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, EyeOff, Mail, Lock, ArrowRight } from "lucide-react";

const LoginSchema = Yup.object().shape({
  email: Yup.string().email("Enter a valid email address").required("Email is required"),
  password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
});

interface LoginFormProps {
  onSubmit?: (values: { email: string; password: string; rememberMe: boolean }) => void;
  isLoading?: boolean;
}

export default function LoginForm({ onSubmit, isLoading = false }: LoginFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [generalError, setGeneralError] = useState<string | null>(null);

  const handleFormSubmit = (values: { email: string; password: string; rememberMe: boolean }) => {
    setGeneralError(null);
    if (onSubmit) {
      onSubmit(values);
    } else {
      alert(`Signing in with: ${values.email}`);
    }
  };

  return (
    <Formik
      initialValues={{ email: "", password: "", rememberMe: false }}
      validationSchema={LoginSchema}
      onSubmit={(values, { setSubmitting }) => {
        handleFormSubmit(values);
        setSubmitting(false);
      }}
    >
      {({ values, errors, touched, handleChange, handleBlur, setFieldValue, isSubmitting }) => (
        <Form className="flex flex-col gap-4 w-full">
          {/* Email Address */}
          <div className="text-left w-full">
            <label htmlFor="email" className="text-xs font-bold text-slate-800 mb-2 block tracking-wide">
              Email Address
            </label>
            <div className="relative w-full">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 pointer-events-none" />
              <Input
                autoFocus
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email"
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
                className="peer w-full h-12 rounded-xl border border-slate-200 bg-white pl-12 pr-4 text-sm text-slate-900 shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15"
              />
            </div>
            {errors.email && touched.email && (
              <span className="text-xs text-red-600 mt-1.5 block font-semibold">{errors.email}</span>
            )}
          </div>

          {/* Password */}
          <div className="text-left w-full">
            <label htmlFor="password" className="text-xs font-bold text-slate-800 mb-2 block tracking-wide">
              Password
            </label>
            <div className="relative w-full">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 pointer-events-none" />
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={values.password}
                onChange={handleChange}
                onBlur={handleBlur}
                className="peer w-full h-12 rounded-xl border border-slate-200 bg-white pl-12 pr-12 text-sm text-slate-900 shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-50 focus-visible:ring-0"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="h-[18px] w-[18px]" /> : <Eye className="h-[18px] w-[18px]" />}
              </Button>
            </div>
            {errors.password && touched.password && (
              <span className="text-xs text-red-600 mt-1.5 block font-semibold">{errors.password}</span>
            )}
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between gap-2 text-xs font-medium mt-1">
            <label className="inline-flex items-center gap-2 text-slate-500 cursor-pointer select-none">
              <Checkbox
                id="rememberMe"
                checked={values.rememberMe}
                onCheckedChange={(checked) => setFieldValue("rememberMe", checked)}
                className="h-4.5 w-4.5 rounded border-slate-350 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
              />
              Remember me
            </label>
            <Button
              type="button"
              variant="link"
              className="text-xs font-bold text-blue-600 hover:text-blue-700 p-0 h-auto cursor-pointer"
              onClick={() => alert("Redirecting to Forgot Password recovery option.")}
            >
              Forgot Password?
            </Button>
          </div>

          {generalError && (
            <p className="text-xs text-red-600 text-center font-semibold">{generalError}</p>
          )}

          {/* Sign In Button */}
          <Button
            type="submit"
            className="h-12 w-full rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-sm font-bold shadow-md shadow-blue-500/10 hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer mt-2"
            disabled={isSubmitting || isLoading}
          >
            {isSubmitting || isLoading ? (
              "Signing In..."
            ) : (
              <span className="inline-flex items-center gap-1.5">
                Sign In <ArrowRight className="h-4 w-4" />
              </span>
            )}
          </Button>

          {/* Divider */}
          <div className="relative my-3 flex items-center justify-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200/80"></div>
            </div>
            <span className="relative bg-white px-3 text-[10px] uppercase font-bold tracking-wider text-slate-400">
              or continue with
            </span>
          </div>

          {/* Social Logins */}
          <div className="grid gap-3 w-full">
            {/* Google */}
            <button
              type="button"
              className="w-full h-11 border border-slate-200 rounded-xl bg-white text-xs font-bold text-slate-700 hover:bg-slate-50 hover:border-slate-350 transition-all duration-150 flex items-center justify-center cursor-pointer shadow-sm"
              onClick={() => alert("Login with Google initiated.")}
            >
              <svg className="h-4 w-4 mr-2.5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335" />
              </svg>
              Login with Google
            </button>

            {/* Microsoft */}
            <button
              type="button"
              className="w-full h-11 border border-slate-200 rounded-xl bg-white text-xs font-bold text-slate-700 hover:bg-slate-50 hover:border-slate-350 transition-all duration-150 flex items-center justify-center cursor-pointer shadow-sm"
              onClick={() => alert("Login with Microsoft initiated.")}
            >
              <svg className="h-4 w-4 mr-2.5" viewBox="0 0 23 23">
                <rect x="0" y="0" width="11" height="11" fill="#F25022" />
                <rect x="12" y="0" width="11" height="11" fill="#7FBA00" />
                <rect x="0" y="12" width="11" height="11" fill="#00A4EF" />
                <rect x="12" y="12" width="11" height="11" fill="#FFB900" />
              </svg>
              Login with Microsoft
            </button>
          </div>

          {/* Administrative Footer */}
          <div className="text-center text-xs font-medium text-slate-400 mt-3">
            Don't have an account?{" "}
            <button
              type="button"
              className="text-blue-600 hover:text-blue-700 font-bold cursor-pointer transition-colors"
              onClick={() => alert("Contacting administrator for registration options.")}
            >
              Contact Admin
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
}
