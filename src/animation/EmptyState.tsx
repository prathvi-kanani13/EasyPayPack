import Lottie from "lottie-react";
import noDataAnimation from "./Not Found.json";

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
