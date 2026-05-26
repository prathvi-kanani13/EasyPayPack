import { useState } from "react";
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogAction,
    AlertDialogMedia,
    AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { Textarea } from "@/components/ui/textarea";
import { AlertContext, type AlertOptions } from "../context/AlertContext";
import { IoMdInformationCircleOutline } from "react-icons/io";
import { Trash2, CircleX, Info, TriangleAlert, CircleCheck, type LucideIcon } from 'lucide-react'

type AlertResult = {
    isConfirmed: boolean;
    remarks?: string;
};

const IconVariants: Record<'warning' | 'success' | 'danger' | 'info' | 'error', { class: string, icon: LucideIcon }> = {
    info: { icon: Info, class: 'bg-blue-400/10 text-blue-400' },
    warning: { icon: TriangleAlert, class: 'bg-yellow-400/10 text-yellow-400' },
    danger: { icon: Trash2, class: 'bg-destructive/10 text-destructive' },
    success: { icon: CircleCheck, class: 'bg-green-400/10 text-green-400' },
    error: { icon: CircleX, class: 'bg-destructive/10 text-destructive' },
};

export const AlertProvider = ({ children }: { children: React.ReactNode }) => {
    const [open, setOpen] = useState<boolean>(false);
    const [options, setOptions] = useState<AlertOptions>({});
    const [remarks, setRemarks] = useState<string>("");
    const [inputValidationError, setInputValidationError] = useState<string>("");
    const [resolver, setResolver] = useState<((value: AlertResult) => void) | null>(null);

    const showAlert = (opts: AlertOptions): Promise<AlertResult> => {
        setOptions(opts);
        setRemarks("");
        setOpen(true);

        return new Promise((resolve) => {
            setResolver(() => resolve);
        });
    };

    const handleConfirm = () => {
        const error = options?.inputValidator?.(remarks);
        if (options?.withRemarks && error) {
            setInputValidationError(error);
            return;
        }

        resolver?.({
            isConfirmed: true,
            ...(options.withRemarks && { remarks }),
        });
        setOpen(false);
    };

    const handleCancel = () => {
        resolver?.({ isConfirmed: false });
        setOpen(false);
    };

    const Icon = (options?.variant && IconVariants[options.variant].icon)
        ?? IoMdInformationCircleOutline;

    const iconClasses: string = (options?.variant && IconVariants[options.variant].class)
        ?? 'bg-blue-400/10 text-blue-400';

    return (
        <AlertContext.Provider value={{ showAlert }}>
            {children}

            <AlertDialog open={open} onOpenChange={setOpen}>
                <AlertDialogContent size="sm" className="p-4">
                    <AlertDialogHeader>
                        <AlertDialogMedia className={iconClasses}>
                            <Icon />
                        </AlertDialogMedia>
                        <AlertDialogTitle>{options.title}</AlertDialogTitle>
                        <AlertDialogDescription>
                            {typeof options.description === "string" ? (
                                <span dangerouslySetInnerHTML={{ __html: options.description }} />
                            ) : (
                                options.description
                            )}
                        </AlertDialogDescription>
                    </AlertDialogHeader>

                    {/* Case 3 — remarks textarea */}
                    {options.withRemarks && (
                        <div className="flex flex-col gap-2">
                            <Textarea
                                value={remarks}
                                onChange={(e) => setRemarks(e.target.value)}
                                placeholder={options.remarksPlaceholder ?? "Enter your remarks..."}
                                className="resize-none"
                                rows={3}
                            />
                            {inputValidationError && (<div className="text-sm text-red-500">{inputValidationError}</div>)}
                        </div>
                    )}

                    <AlertDialogFooter className={`${options.confirmation ? '' : "grid-cols-1!"}`}>
                        {options.confirmation || options.withRemarks ? (
                            <>
                                <AlertDialogAction onClick={(e) => {
                                    e.preventDefault();
                                    handleConfirm();
                                }}>
                                    {options?.buttonText ?? 'OK'}
                                </AlertDialogAction>
                                <AlertDialogCancel onClick={handleCancel}>
                                    Cancel
                                </AlertDialogCancel>
                            </>
                        ) : (
                            // Case 1 — simple alert
                            <AlertDialogAction
                                onClick={() => {
                                    options.onConfirm?.();
                                    setOpen(false);
                                }}
                            >
                                {options?.buttonText ?? 'OK'}
                            </AlertDialogAction>
                        )}
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </AlertContext.Provider>
    );
};