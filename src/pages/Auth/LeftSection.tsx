import LottieComponent from "lottie-react";
import logo from "../../assets/logo.png";

// Resolve CommonJS vs ESM default import mismatch for lottie-react
const Lottie = (LottieComponent as unknown as { default?: typeof LottieComponent }).default || LottieComponent;

interface LeftSectionProps {
    selectedAnimation: unknown;
    componentName: string;
}

// LeftSection component displays the branding logo, primary marketing headlines, 
// a dynamic Lottie illustration, and key feature descriptions.
export default function LeftSection({ selectedAnimation, componentName }: LeftSectionProps) {
    const animationWidth = componentName === 'login' ? '87vh' : componentName === 'otp' ? '50vh' : '60vh';
    return (
        <div className="relative flex flex-col w-full h-full max-h-screen p-4 pl-20 lg:pt-[5vh] justify-between bg-transparent items-center">
            {/* Top-left decorative curved shape */}
            <svg
                className="absolute top-0 left-0 w-32 h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 pointer-events-none"
                viewBox="0 0 115 115"
                preserveAspectRatio="none"
            >
                <defs>
                    <linearGradient id="topLeftGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#7350e7" />
                        <stop offset="100%" stopColor="var(--theme)" />
                    </linearGradient>
                </defs>
                <path d="M 0 0 L 100 0 Q 10 0, 10 100 Q 10 113, 0 115 L 0 110 Z" fill="url(#topLeftGradient)" />
            </svg>

            <div className="relative flex flex-col h-full w-full z-10">
                {/* Branding Logo Section */}
                <div className="flex items-center gap-3">
                    <img src={logo} alt="Easy PayPack Logo" className="h-[12vh] w-auto object-contain pointer-events-none" />
                </div>

                {/* Headline Section */}
                <div className="flex flex-col gap-3 pl-[11.5vh] mt-4">
                    <h2 className="text-3xl lg:text-[4vh] font-bold text-[#242664] dark:text-foreground tracking-tight leading-tight">
                        Smart HR Solution<br />
                        for a <span className="bg-linear-to-r text-[6vh] from-[#7350e7] to-theme bg-clip-text text-transparent">Smarter Workforce</span>
                    </h2>
                    <div className="w-12 h-1 bg-[#242664]/20 dark:bg-muted-foreground/20 rounded-full" />
                    <p className="max-w-lg text-gray-500 dark:text-gray-400 text-[2.25vh] leading-relaxed">
                        EasyPayPack helps you manage your people, processes and performance – all in one place.
                    </p>
                </div>

                {/* Illustration Lottie Animation Container */}
                <div className="flex-1 flex justify-center items-start w-full min-h-[250px] overflow-visible">
                    <Lottie
                        animationData={selectedAnimation}
                        loop
                        autoplay
                        className="w-auto h-auto object-contain"
                        style={{ maxWidth: animationWidth }}
                    />
                </div>
            </div>
        </div>
    );
}
