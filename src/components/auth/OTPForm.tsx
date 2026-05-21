import { useEffect, useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

// Formik Validation Schema using Yup
const OTPSchema = Yup.object().shape({
  otp: Yup.string()
    .length(6, "OTP must be exactly 6 digits")
    .matches(/^\d+$/, "OTP must contain only numbers")
    .required("OTP is required"),
});

interface OTPFormProps {
  onSubmit: (values: { otp: string }) => void;
  onResend: () => void;
}

export default function OTPForm({
  onSubmit,
  onResend
}: OTPFormProps) {
  const navigate = useNavigate();
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
    if (onResend) {
      onResend();
    } else {
      console.log("OTP Resent");
    }
  };

  return (
    <Formik
      initialValues={{ otp: "" }}
      validationSchema={OTPSchema}
      onSubmit={(values, { setSubmitting }) => {
        if (onSubmit) {
          onSubmit(values);
        }

        navigate("/dashboard");
        setSubmitting(false);
      }}
    >
      {({ values, errors, touched, setFieldValue, submitForm }) => (
        <Form className="space-y-6 flex flex-col justify-between">
          {/* OTP Input container */}
          <div className="w-full py-2 flex justify-center">
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
              containerClassName="w-full"
            >
              <InputOTPGroup className="flex justify-center w-full gap-1.5 sm:gap-2.5">
                {[0, 1, 2, 3, 4, 5].map((index) => (
                  <InputOTPSlot
                    key={index}
                    index={index}
                    className="flex-1 h-12 max-w-12 sm:h-14 sm:max-w-14 border border-gray-300 rounded-lg text-lg font-semibold bg-white/70 shadow-sm text-center [text-security:disc] [-webkit-text-security:disc]"
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
                className="text-xs sm:text-sm font-semibold text-theme hover:text-theme/80 p-0 h-auto cursor-pointer decoration-theme"
                onClick={handleResend}
              >
                Resend OTP
              </Button>
            )}
          </div>

          {/* Fallback Submit Button */}
          <Button
            type="submit"
            size="lg"
            className="h-12 w-full px-8 text-sm sm:text-base bg-[linear-gradient(90deg,rgba(66,78,250)_20%,rgba(115,80,231,1)_100%)] hover:bg-none hover:bg-theme text-white font-medium rounded-md transition-all duration-200 gap-2"
          >
            Submit <ArrowRight />
          </Button>

        </Form>
      )}
    </Formik>
  );
}
