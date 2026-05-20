import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate, useLocation } from "react-router-dom";
import { useRef, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import type React from "react";
import { Label } from "../ui/label";

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

    const handleResetPassword = () => {
        setError(null);
        // Reset password API handler logic to be implemented here
    };

    return (
        <form
            className="flex flex-col gap-4"
            onSubmit={(e) => e.preventDefault()}
        >
            {/* USER ID */}
            <div>
                <Label className="text-[#696969] text-sm sm:text-md md:text-lg font-medium mb-1 block">
                    Email
                </Label>

                <div className="relative w-full">
                    <Input
                        value={userName || ""}
                        disabled
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
            </div>

            {/* OTP */}
            <div>
                <Label className="text-[#696969] text-sm sm:text-md md:text-lg font-medium mb-1 block">
                    OTP
                </Label>

                <div className="relative w-full">
                    <Input
                        ref={otpRef}
                        autoFocus
                        placeholder="Enter 6 digit OTP"
                        maxLength={6}
                        onInput={(e: React.FormEvent<HTMLInputElement>) => {
                            const target = e.target as HTMLInputElement;
                            target.value = target.value.replace(/[^0-9]/g, "");
                        }}
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
            </div>

            {/* PASSWORD */}
            <div>
                <Label className="text-[#696969] text-sm sm:text-md md:text-lg font-medium mb-1 block">
                    Password
                </Label>

                <div className="relative w-full">
                    <Input
                        type={showPassword ? "text" : "password"}
                        ref={passwordRef}
                        placeholder="Enter New Password"
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                e.preventDefault();
                                confirmPasswordRef.current?.focus();
                            }
                        }}
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
                        aria-Label={showPassword ? "Hide password" : "Show password"}
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
            </div>

            {/* CONFIRM PASSWORD */}
            <div>
                <Label className="text-[#696969] text-sm sm:text-md md:text-lg font-medium mb-1 block">
                    Confirm Password
                </Label>

                <div className="relative w-full">
                    <Input
                        type={showConfirmPassword ? "text" : "password"}
                        ref={confirmPasswordRef}
                        placeholder="Enter Confirm Password"
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                e.preventDefault();
                                handleResetPassword();
                            }
                        }}
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
                        onClick={() => setShowConfirmPassword((prev) => !prev)}
                        className="
                            absolute right-0 top-1/2 -translate-y-1/2
                            h-8 w-8
                            text-gray-400 hover:text-gray-600
                            hover:bg-transparent
                            focus-visible:ring-0
                        "
                        aria-Label={showConfirmPassword ? "Hide password" : "Show password"}
                    >
                        {showConfirmPassword ? (
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
            </div>

            {/* ERROR */}
            {error && (
                <p className="text-red-600 text-sm text-center">
                    {error}
                </p>
            )}

            <div className="flex gap-3 mt-2">

                {/* OK BUTTON */}
                <Button
                    type="button"
                    onClick={handleResetPassword}
                    className="h-10 flex-1 bg-theme hover:bg-theme/90 text-white"
                >
                    OK
                </Button>

                {/* CANCEL BUTTON */}
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate("/login")}
                    className="h-10 flex-1"
                >
                    Cancel
                </Button>

            </div>
        </form>
    );
};

export default ForgotPassword;