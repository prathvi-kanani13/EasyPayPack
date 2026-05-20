import { useEffect, useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { ArrowLeft } from "lucide-react";

// Formik Validation Schema using Yup
const OTPSchema = Yup.object().shape({
  otp: Yup.string()
    .length(6, "OTP must be exactly 6 digits")
    .matches(/^\d+$/, "OTP must contain only numbers")
    .required("OTP is required"),
});

interface OTPFormProps {
  onSubmit: (values: { otp: string }) => void;
  onBack: () => void;
  onResend: () => void;
  isLoading?: boolean;
  userEmailOrPhone?: string;
}

export default function OTPForm({
  onSubmit,
  onBack,
  onResend,
  isLoading = false,
  userEmailOrPhone = "your registered email/phone",
}: OTPFormProps) {
  const [timeLeft, setTimeLeft] = useState(60);

  // Timer countdown hook for Resend OTP
  useEffect(() => {
    if (timeLeft === 0) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleResend = () => {
    setTimeLeft(60);
    onResend();
  };

  return (
    <Formik
      initialValues={{ otp: "" }}
      validationSchema={OTPSchema}
      onSubmit={(values, { setSubmitting }) => {
        onSubmit(values);
        setSubmitting(false);
      }}
    >
      {({ values, errors, touched, setFieldValue, submitForm, isSubmitting }) => (
        <Form className="space-y-6 flex flex-col justify-between">

          {/* Back button to Login */}
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-1.5 text-xs sm:text-sm font-medium text-gray-500 hover:text-gray-800 transition-colors w-fit group cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
            Back to Login
          </button>

          {/* Description */}
          <div className="flex flex-col gap-1 pl-1">
            <h4 className="scroll-m-20 text-lg sm:text-xl font-semibold tracking-tight text-gray-800">
              2-Factor Authentication
            </h4>
            <p className="text-xs sm:text-sm text-gray-500 leading-snug">
              Enter the 6-digit security code sent to <span className="font-semibold text-gray-700">{userEmailOrPhone}</span>.
            </p>
          </div>

          {/* OTP Input container */}
          <div className="py-2 flex justify-center">
            <InputOTP
              maxLength={6}
              value={values.otp}
              onChange={(val) => {
                setFieldValue("otp", val);
                // Trigger auto-submit when all 6 fields are filled
                if (val.length === 6) {
                  setTimeout(() => {
                    submitForm();
                  }, 100);
                }
              }}
              pattern={REGEXP_ONLY_DIGITS}
            >
              <InputOTPGroup className="flex justify-between w-full gap-1.5 sm:gap-2.5 max-w-sm">
                {[0, 1, 2, 3, 4, 5].map((index) => (
                  <InputOTPSlot
                    key={index}
                    index={index}
                    className="flex-1 h-12 w-10 sm:h-14 sm:w-12 border border-gray-300 rounded-lg text-center text-lg font-semibold bg-white/70 shadow-sm focus:border-[#FF6600] focus:ring-1 focus:ring-[#FF6600]"
                  />
                ))}
              </InputOTPGroup>
            </InputOTP>
          </div>

          {/* Error Message */}
          {errors.otp && touched.otp && (
            <p className="text-red-500 text-xs sm:text-sm text-center font-medium animate-in fade-in slide-in-from-top-1 duration-200">
              {errors.otp}
            </p>
          )}

          {/* Cooldown Timer / Resend OTP Action */}
          <div className="text-center text-xs sm:text-sm text-gray-500 font-medium py-1">
            {timeLeft > 0 ? (
              <p>
                Resend code in <span className="font-semibold text-gray-700">{timeLeft}s</span>
              </p>
            ) : (
              <Button
                type="button"
                variant="link"
                className="text-xs sm:text-sm font-semibold text-[#FF6600] hover:text-[#e65c00] p-0 h-auto cursor-pointer decoration-[#FF6600]"
                onClick={handleResend}
              >
                Resend OTP
              </Button>
            )}
          </div>

          {/* Fallback Submit Button */}
          <Button
            type="submit"
            className="h-10 md:h-12 w-full text-sm sm:text-base bg-[#FF6600] hover:bg-[#e65c00] text-white font-medium rounded-md transition-all duration-200 cursor-pointer shadow-md hover:shadow-lg active:scale-[0.98]"
            disabled={isSubmitting || isLoading}
          >
            {isSubmitting || isLoading ? "VERIFYING..." : "CONFIRM"}
          </Button>

        </Form>
      )}
    </Formik>
  );
}
