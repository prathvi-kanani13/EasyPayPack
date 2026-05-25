import LottieComponent from "lottie-react";
import noDataAnimation from "./lottie/Not Found.json";

// Resolve CommonJS vs ESM default import mismatch for lottie-react
const Lottie = (LottieComponent as unknown as { default?: typeof LottieComponent }).default || LottieComponent;

type EmptyStateProps = {
    message?: string;
};

export default function EmptyState({
    message = "No data found.",
}: EmptyStateProps) {
    return (
        <div className="flex flex-col items-center justify-center">
            <Lottie
                animationData={noDataAnimation}
                loop
                className="w-52 h-52"
            />
            <p className="text-lg text-gray-500">{message}</p>
        </div>
    );
}
