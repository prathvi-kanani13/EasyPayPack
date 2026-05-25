// import image from "../assets/group.png"
import { Card, CardContent } from "@/components/ui/card";
import LoginComponent from "@/components/auth/LoginForm";
import OTPComponent from "@/components/auth/OTPForm";
import ForgotPasswordComponent from "@/components/auth/ForgotPassword";
import type React from "react";
import animationData from "@/animation/lottie/Data Visualization.json";
import otpAnimation from "@/animation/lottie/OTP.json";
import forgotQAnimation from "@/animation/lottie/Forgot Password.json";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import LeftSection from "../auth/LeftSection";

type TPageContent = {
    title: string,
    description: string,
    component: React.FC
}

export default function Login(props: { component: 'login' | 'otp' | 'forgotPassword' }) {

    const navigate = useNavigate();

    const isMobile = window.innerWidth < 768;

    const pageContent: Record<'login' | 'otp' | 'forgotPassword', TPageContent> = {
        login: {
            title: 'Welcome back!👋',
            description: 'Sign in to your EasyPayPack account.',
            component: LoginComponent
        },
        otp: {
            title: '2-Factor Authentication',
            description: 'Enter the OTP sent to your email address.',
            component: OTPComponent
        },
        forgotPassword: {
            title: 'We\'ve got your back!',
            description: 'Reset your password hassle-free.',
            component: ForgotPasswordComponent
        },
    };

    const AuthComponent = pageContent[props.component].component;

    const selectedAnimation =
        props.component === "otp"
            ? otpAnimation
            : props.component === "forgotPassword"
                ? forgotQAnimation
                : animationData;

    const [showLanding, setShowLanding] = useState<boolean>(isMobile && props.component === 'login');

    // redirect to dashboard if user is already logged in
    useEffect(() => {
        const accessToken = sessionStorage.getItem("accessToken");
        const refreshToken = sessionStorage.getItem("refreshToken");
        const loggedInUser = sessionStorage.getItem("loggedInUser");

        if (accessToken && refreshToken && loggedInUser) {
            navigate("/employee-dashboard");
        }
    }, [navigate]);

    useEffect(() => {
        if (!showLanding) return;
        setTimeout(() => {
            setShowLanding(false);
        }, 1785);
    }, [showLanding]);

    return (
        <div className="min-h-screen flex flex-col md:flex-row bg-[linear-gradient(115deg,rgba(255,255,255,1)_0%,rgba(250,250,250,1)_50%,rgba(115,80,231,1)_89%,rgba(66,78,250)_100%)]">
            {/* left side */}
            <div className="relative flex w-full md:w-[60%] min-h-[60vh] md:min-h-screen overflow-hidden max-md:hidden">
                <LeftSection selectedAnimation={selectedAnimation} componentName={props.component} />
            </div>

            {/* right side */}
            <div className="flex flex-1 items-center justify-center px-4 md:pr-6 lg:px-15 py-10 md:py-0">
                <div className="w-full flex justify-center">
                    <Card className="w-full max-w-125 rounded-xl shadow-4xl border border-gray-200 flex flex-col gap-6 p-4 md:p-6 lg:px-[7vh] lg:py-[6vh]">
                        <div className="w-full">
                            <h1 className="text-2xl lg:text-[2vw] font-semibold text-[#242664]">{pageContent[props.component].title}</h1>
                            <p className="text-sm lg:text-[1.1vw] text-[#8f94ac]">{pageContent[props.component].description}</p>
                        </div>

                        {/* Form */}
                        <CardContent className="flex-1 px-0">
                            <AuthComponent />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}