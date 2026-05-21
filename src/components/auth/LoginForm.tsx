import { useNavigate } from "react-router-dom";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { Button } from "@/components/ui/button";
import { useState, useRef } from "react";
import { Checkbox } from "../ui/checkbox";
import { ArrowRight, Eye, EyeOff, Mail, Lock } from "lucide-react";
import { Label } from "../ui/label";
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupButton } from "../ui/input-group";

// import { useLogin } from "../../hook/UseLogin";
// import { useAuth } from "../../context/AuthProvider";
// import { parseOTPResult } from "@/api/parseOtp";
// import { useForgotPassword } from "../../hook/UseForgotPass";


// LoginSchema defines validation rules for User ID and Password using Yup
const LoginSchema = Yup.object().shape({
  employeeId: Yup.string().required("User ID is required"),
  password: Yup.string().min(1, "Password must be at least 1 character").required("Password is required"),
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
            <Label className="text-[#8f94ac] text-sm sm:text-md lg:text-lg font-medium mb-1 sm:mb-2 block">
              Email Address
            </Label>

            <div className="relative w-full">
              <InputGroup
                className="h-12 gap-2 p-1 rounded-sm"
              >
                <InputGroupAddon>
                  <Mail />
                </InputGroupAddon>
                <InputGroupInput
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
                  className="w-full placeholder:text-[#B2B2B2]"
                />
              </InputGroup>
            </div>

          </div>

          {/* Password Input Section */}
          <div>
            <Label className="text-[#8f94ac] text-sm sm:text-md lg:text-lg font-medium mb-1 sm:mb-2 block">
              Password
            </Label>

            <div className="relative w-full">
              {/* InputGroup wraps the input and accessory components like Lock icon and Eye toggle */}
              <InputGroup className="h-12 gap-2 p-1 rounded-sm">
                {/* InputGroupAddon for the leading Lock icon */}
                <InputGroupAddon align="inline-start">
                  <Lock />
                </InputGroupAddon>

                {/* InputGroupInput handles password text input */}
                <InputGroupInput
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={values.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  ref={passwordRef}
                  className="w-full placeholder:text-[#B2B2B2]"
                />

                {/* InputGroupAddon for the trailing Eye toggle button */}
                <InputGroupAddon align="inline-end">
                  {/* InputGroupButton handles toggling password visibility */}
                  <InputGroupButton
                    size="icon-sm"
                    onClick={() => setShowPassword((prev) => !prev)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="pl-0"
                  >
                    {showPassword ? (
                      <EyeOff />
                    ) : (
                      <Eye />
                    )}
                  </InputGroupButton>
                </InputGroupAddon>
              </InputGroup>
            </div>

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

          {/* Formik Error display - only one at a time */}
          {((touched.employeeId && errors.employeeId) || (touched.password && errors.password)) && (
            <p className="text-xs text-red-600 font-semibold text-center">
              {touched.employeeId && errors.employeeId ? errors.employeeId : errors.password}
            </p>
          )}

          {Error && (
            <p className="text-red-600 text-sm text-center">
              {Error}
            </p>
          )}

          {/* Login Submission Button */}
          <Button
            type="submit"
            size="lg"
            className="h-12 w-full px-8 text-sm sm:text-base bg-[linear-gradient(90deg,rgba(66,78,250)_20%,rgba(115,80,231,1)_100%)] hover:bg-theme text-white font-medium rounded-md transition-all duration-200 gap-2"
          >
            Sign In <ArrowRight />
          </Button>

        </Form>
      )}
    </Formik>
  );
}

export default Login;
