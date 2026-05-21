import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from "react-router-dom";
import { useRef, useState } from "react";
import { Eye, EyeOff, Lock, Mail, RectangleEllipsis } from "lucide-react";
import { Label } from "../ui/label";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "../ui/input-group";

// ForgotPasswordSchema defines validation rules for the OTP and password reset fields using Yup
const ForgotPasswordSchema = Yup.object().shape({
    email: Yup.string().required("Email is required"),
    otp: Yup.string()
        .matches(/^\d{6}$/, "OTP must be exactly 6 digits")
        .required("OTP is required"),
    password: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .required("Password is required"),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref("password")], "Passwords must match")
        .required("Confirm Password is required"),
});

// ForgotPassword component handles OTP verification and password resetting
const ForgotPassword = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const userName =
        location.state?.userName || sessionStorage.getItem("otpUser");

    const otpRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    const confirmPasswordRef = useRef<HTMLInputElement>(null);

    const [error, setError] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleResetPassword = (values: { otp: string; password: string }) => {
        setError(null);
        console.log("Form values submitted:", values);
        // Reset password API handler logic to be implemented here
    };

    return (
        // Formik component initialized with initialValues, validationSchema and onSubmit handler
        <Formik
            initialValues={{
                email: userName || "",
                otp: "",
                password: "",
                confirmPassword: "",
            }}
            validationSchema={ForgotPasswordSchema}
            onSubmit={(values, { setSubmitting }) => {
                handleResetPassword(values);
                setSubmitting(false);
            }}
        >
            {({ values, errors, touched, handleChange, handleBlur, setFieldValue }) => {
                // Determine the first active Formik error to display
                const firstError = (touched.email && errors.email)
                    ? errors.email
                    : (touched.otp && errors.otp)
                        ? errors.otp
                        : (touched.password && errors.password)
                            ? errors.password
                            : (touched.confirmPassword && errors.confirmPassword)
                                ? errors.confirmPassword
                                : null;

                return (
                    // Form wrapper component handles the form validation and submit events
                    <Form className="flex flex-col gap-4">
                    {/* USER ID Field Section */}
                    <div>
                        {/* Label component to describe the Email field */}
                        <Label className="text-[#696969] text-sm sm:text-md lg:text-lg font-medium mb-1 block">
                            Email
                        </Label>

                        <div className="relative w-full">
                            {/* Input component for displaying the read-only/disabled email */}
                            <InputGroup className="h-12 gap-2 p-1 rounded-sm">
                                {/* InputGroupAddon for the leading Lock icon */}
                                <InputGroupAddon align="inline-start">
                                    <Mail />
                                </InputGroupAddon>

                                {/* InputGroupInput handles password text input */}
                                <InputGroupInput
                                    name="email"
                                    type={"text"}
                                    value={values.email}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    className="w-full placeholder:text-[#B2B2B2]"
                                    disabled
                                />
                            </InputGroup>
                        </div>

                    </div>

                    {/* OTP Field Section */}
                    <div>
                        {/* Label component for the OTP input */}
                        <Label className="text-[#696969] text-sm sm:text-md lg:text-lg font-medium mb-1 block">
                            OTP
                        </Label>

                        <div className="relative w-full">
                            {/* Input component for the 6-digit OTP code */}
                            <InputGroup className="h-12 gap-2 p-1 rounded-sm">
                                {/* InputGroupAddon for the leading Lock icon */}
                                <InputGroupAddon align="inline-start">
                                    <RectangleEllipsis />
                                </InputGroupAddon>

                                {/* InputGroupInput handles password text input */}
                                <InputGroupInput
                                    ref={otpRef}
                                    name="otp"
                                    value={values.otp}
                                    onChange={(e) => {
                                        const val = e.target.value.replace(/[^0-9]/g, "");
                                        setFieldValue("otp", val);
                                    }}
                                    onBlur={handleBlur}
                                    autoFocus
                                    placeholder="Enter 6 digit OTP"
                                    maxLength={6}
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

                    {/* PASSWORD Field Section */}
                    <div>
                        {/* Label component for the new password */}
                        <Label className="text-[#696969] text-sm sm:text-md lg:text-lg font-medium mb-1 block">
                            Password
                        </Label>

                        <div className="relative w-full">
                            {/* Input component for entering new password */}
                            <InputGroup className="h-12 gap-2 p-1 rounded-sm">
                                {/* InputGroupAddon for the leading Lock icon */}
                                <InputGroupAddon align="inline-start">
                                    <Lock />
                                </InputGroupAddon>

                                {/* InputGroupInput handles password text input */}
                                <InputGroupInput
                                    name="password"
                                    value={values.password}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    type={showPassword ? "text" : "password"}
                                    ref={passwordRef}
                                    placeholder="Enter New Password"
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            e.preventDefault();
                                            confirmPasswordRef.current?.focus();
                                        }
                                    }}
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

                    {/* CONFIRM PASSWORD Field Section */}
                    <div>
                        {/* Label component for confirming the new password */}
                        <Label className="text-[#696969] text-sm sm:text-md lg:text-lg font-medium mb-1 block">
                            Confirm Password
                        </Label>

                        <div className="relative w-full">
                            {/* Input component for confirming the new password */}
                            <InputGroup className="h-12 gap-2 p-1 rounded-sm">
                                {/* InputGroupAddon for the leading Lock icon */}
                                <InputGroupAddon align="inline-start">
                                    <Lock />
                                </InputGroupAddon>

                                {/* InputGroupInput handles password text input */}
                                <InputGroupInput
                                    name="confirmPassword"
                                    type={showConfirmPassword ? "text" : "password"}
                                    placeholder="Enter Confirm Password"
                                    value={values.confirmPassword}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    ref={confirmPasswordRef}
                                    className="w-full placeholder:text-[#B2B2B2]"
                                />

                                {/* InputGroupAddon for the trailing Eye toggle button */}
                                <InputGroupAddon align="inline-end">
                                    {/* InputGroupButton handles toggling password visibility */}
                                    <InputGroupButton
                                        size="icon-sm"
                                        onClick={() => setShowConfirmPassword((prev) => !prev)}
                                        aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                                        className="pl-0"
                                    >
                                        {showConfirmPassword ? (
                                            <EyeOff />
                                        ) : (
                                            <Eye />
                                        )}
                                    </InputGroupButton>
                                </InputGroupAddon>
                            </InputGroup>
                        </div>

                    </div>

                    {/* Formik Error display - only one at a time */}
                    {firstError && typeof firstError === "string" && (
                        <p className="text-xs text-red-600 font-semibold text-center">
                            {firstError}
                        </p>
                    )}

                    {/* Error display */}
                    {error && (
                        <p className="text-red-600 text-sm text-center">
                            {error}
                        </p>
                    )}

                    <div className="flex gap-3 mt-2">
                        {/* Button component to submit the password reset form */}
                        <Button
                            type="submit"
                            className="h-10 flex-1 bg-theme hover:bg-theme/90 text-white"
                        >
                            OK
                        </Button>

                        {/* Button component to cancel/return to login */}
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => navigate("/login")}
                            className="h-10 flex-1"
                        >
                            Cancel
                        </Button>
                    </div>
                </Form>
                );
            }}
        </Formik>
    );
};

export default ForgotPassword;