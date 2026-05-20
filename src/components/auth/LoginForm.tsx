import { useNavigate } from "react-router-dom";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useRef } from "react";
import { Checkbox } from "../ui/checkbox";
import { Eye, EyeOff } from "lucide-react";
import { Label } from "../ui/label";

// import { useLogin } from "../../hook/UseLogin";
// import { useAuth } from "../../context/AuthProvider";
// import { parseOTPResult } from "@/api/parseOtp";
// import { useForgotPassword } from "../../hook/UseForgotPass";


// LoginSchema defines validation rules for User ID and Password using Yup
const LoginSchema = Yup.object().shape({
  employeeId: Yup.string().required("User ID is required"),
  password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
});

// Login Component manages the authentication interface, credentials verification, and recovery request
const Login = () => {
  const navigate = useNavigate();
  const [Error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  // const loginMutation = useLogin();
  // const forgotPasswordMutation = useForgotPassword();
  // const { loginWithTokens } = useAuth();

  const passwordRef = useRef<HTMLInputElement>(null);

  const onSubmit = async (values: { employeeId: string; password: string; rememberMe: boolean }) => {
    setError(null);

    navigate("/otp", {
      state: {
        userName: values.employeeId,
        password: values.password,
        tranCD: "",
        validFor: "",
        sentOtp: "",
      },
    });

    console.log(values)
  };

  return (
    <Formik
      initialValues={{ employeeId: "", password: "", rememberMe: false }}
      validationSchema={LoginSchema}
      onSubmit={(values, { setSubmitting }) => {
        onSubmit(values);
        setSubmitting(false);
      }}
    >
      {({ values, errors, touched, handleChange, handleBlur, setFieldValue }) => (
        <Form className="flex flex-col justify-between gap-4">

          {/* Username/User ID Input Section */}
          <div>
            <label className="text-[#696969] text-sm sm:text-md md:text-lg font-medium mb-1 sm:mb-2 block">
              Email
            </label>

            <div className="relative w-full">
              <Input
                autoFocus
                name="employeeId"
                type="text"
                placeholder="Enter your User ID"
                value={values.employeeId}
                onChange={handleChange}
                onBlur={handleBlur}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    passwordRef.current?.focus();
                  }
                }}
                className="
                  peer
                  w-full h-10 md:h-12 px-2
                  text-sm md:text-base placeholder:text-[#B2B2B2]
                  border-0 border-b border-gray-300
                  rounded-none bg-transparent
                  shadow-none
                  focus-visible:outline-none
                  focus-visible:ring-0
                  transition-all duration-100
                "
              />
              <span
                className="
                  absolute bottom-0 left-0
                  h-[2px] w-full
                  bg-theme
                  scale-x-0 origin-left
                  transition-transform duration-300 ease-out
                  peer-focus-visible:scale-x-100
                "
              />
            </div>
            {errors.employeeId && touched.employeeId && (
              <span className="text-xs text-red-600 mt-1 block font-semibold">{errors.employeeId}</span>
            )}
          </div>

          {/* Password Input Section */}
          <div>
            <Label className="text-[#696969] text-sm sm:text-md md:text-lg font-medium mb-1 sm:mb-2 block">
              Password
            </Label>

            <div className="relative w-full">
              <Input
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={values.password}
                onChange={handleChange}
                onBlur={handleBlur}
                ref={passwordRef}
                className="
                  peer
                  w-full h-10 md:h-12 px-2 pr-10
                  text-sm md:text-base placeholder:text-[#B2B2B2]
                  border-0 border-b border-gray-300
                  rounded-none bg-transparent
                  shadow-none
                  focus-visible:outline-none
                  focus-visible:ring-0
                  transition-all duration-100
                "
              />

              {/* Eye toggle button */}
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => setShowPassword((prev) => !prev)}
                className="
                  absolute right-0 top-1/2 -translate-y-1/2
                  h-8 w-8
                  text-gray-400 hover:text-gray-600
                  hover:bg-transparent
                  focus-visible:ring-0
                "
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff style={{ height: '18px', width: '18px' }} />
                ) : (
                  <Eye style={{ height: '18px', width: '18px' }} />
                )}
              </Button>

              <span
                className="
                  absolute bottom-0 left-0
                  h-[2px] w-full
                  bg-theme
                  scale-x-0 origin-left
                  transition-transform duration-300 ease-out
                  peer-focus-visible:scale-x-100
                "
              />
            </div>
            {errors.password && touched.password && (
              <span className="text-xs text-red-600 mt-1 block font-semibold">{errors.password}</span>
            )}
          </div>

          {/* Remember Me and Forgot Password Action Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Checkbox
                id="rememberMe"
                checked={values.rememberMe}
                onCheckedChange={(checked) => setFieldValue("rememberMe", !!checked)}
                className="data-[state=checked]:bg-theme data-[state=checked]:border-theme text-white"
              />
              <Label htmlFor="rememberMe" className="text-sm sm:text-md text-gray-700 dark:text-gray-700">
                Remember Me
              </Label>
            </div>

            <Button
              className="text-md hover:underline p-0 cursor-pointer decoration-theme"
              variant="link"
              size={'sm'}
              type="button"
              onClick={(e) => {
                e.preventDefault();

                const userName = values.employeeId;

                if (!userName) {
                  setError("Please enter User ID first");
                  return;
                }

                setError(null);

                navigate("/forgot-password");
              }}
            >
              Forgot Password?
            </Button>
          </div>

          {Error && (
            <p className="text-red-600 text-sm text-center">
              {Error}
            </p>
          )}

          {/* Login Submission Button */}
          <Button
            type="submit"
            className="h-10 w-full px-8 py-2 sm:py-3 text-sm sm:text-base bg-[linear-gradient(90deg,rgba(66,78,250)_20%,rgba(115,80,231,1)_100%)] hover:bg-theme/90 text-white font-medium rounded-md transition-all duration-200"
          >
            LOGIN
          </Button>

        </Form>
      )}
    </Formik>
  );
}

export default Login;
