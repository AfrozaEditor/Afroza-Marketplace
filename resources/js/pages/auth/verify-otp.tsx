import { Head, router, Link } from '@inertiajs/react';
import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Loader2, Mail, RefreshCw } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import AuthLayout from '@/layouts/auth-layout';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface Props {
    email: string;
    expiresAt: string;
    remainingTime: number;
}

export default function VerifyOtp({ email, expiresAt, remainingTime: initialRemainingTime }: Props) {
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [isVerifying, setIsVerifying] = useState(false);
    const [isResending, setIsResending] = useState(false);
    const [remainingTime, setRemainingTime] = useState(initialRemainingTime);
    const [canResend, setCanResend] = useState(false);
    const [resendCooldown, setResendCooldown] = useState(0);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
    const [errors, setErrors] = useState<{ otp?: string; resend?: string }>({});

    // Timer pour le temps restant
    useEffect(() => {
        const timer = setInterval(() => {
            setRemainingTime((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    // Timer pour le cooldown de renvoi
    useEffect(() => {
        if (resendCooldown > 0) {
            const timer = setInterval(() => {
                setResendCooldown((prev) => prev - 1);
            }, 1000);
            return () => clearInterval(timer);
        } else {
            setCanResend(true);
        }
    }, [resendCooldown]);

    // Focus sur le premier input au chargement
    useEffect(() => {
        inputRefs.current[0]?.focus();
    }, []);

    const formatTime = (seconds: number): string => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const handleChange = (index: number, value: string) => {
        // Ne garder que les chiffres
        const digit = value.replace(/\D/g, '').slice(-1);
        
        const newOtp = [...otp];
        newOtp[index] = digit;
        setOtp(newOtp);
        setErrors({});

        // Passer au champ suivant
        if (digit && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }

        // Si tous les champs sont remplis, soumettre automatiquement
        if (newOtp.every(d => d !== '') && digit) {
            handleVerify(newOtp.join(''));
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handlePaste = (e: React.ClipboardEvent) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
        
        if (pastedData.length === 6) {
            const newOtp = pastedData.split('');
            setOtp(newOtp);
            inputRefs.current[5]?.focus();
            handleVerify(pastedData);
        }
    };

    const handleVerify = (code?: string) => {
        const otpCode = code || otp.join('');
        
        if (otpCode.length !== 6) {
            setErrors({ otp: 'Veuillez entrer le code à 6 chiffres' });
            return;
        }

        setIsVerifying(true);
        setErrors({});

        router.post(route('verification.otp.verify'), {
            email,
            otp: otpCode,
        }, {
            onSuccess: () => {
                toast.success('Email vérifié avec succès !');
            },
            onError: (errors) => {
                setIsVerifying(false);
                setErrors(errors as any);
                // Réinitialiser les champs en cas d'erreur
                setOtp(['', '', '', '', '', '']);
                inputRefs.current[0]?.focus();
            },
            onFinish: () => {
                setIsVerifying(false);
            }
        });
    };

    const handleResend = () => {
        if (!canResend) return;

        setIsResending(true);
        setErrors({});

        router.post(route('verification.otp.resend'), {
            email,
        }, {
            onSuccess: () => {
                toast.success('Un nouveau code a été envoyé !');
                setCanResend(false);
                setResendCooldown(60);
                setRemainingTime(600); // 10 minutes
                setOtp(['', '', '', '', '', '']);
                inputRefs.current[0]?.focus();
            },
            onError: (errors) => {
                setErrors(errors as any);
            },
            onFinish: () => {
                setIsResending(false);
            }
        });
    };

    const isExpired = remainingTime <= 0;

    return (
        <AuthLayout 
            title="Vérification de l'email" 
            description="Entrez le code à 6 chiffres envoyé à votre email"
        >
            <Head title="Vérification OTP" />
            
            <div className="flex flex-col gap-6">
                {/* Indication de l'email */}
                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground bg-muted/50 py-3 px-4 rounded-lg">
                    <Mail className="h-4 w-4" />
                    <span>Code envoyé à <strong className="text-foreground">{email}</strong></span>
                </div>

                {/* Timer */}
                <div className="text-center">
                    {isExpired ? (
                        <p className="text-red-500 font-medium">Le code a expiré</p>
                    ) : (
                        <p className="text-muted-foreground">
                            Le code expire dans{' '}
                            <span className={cn(
                                "font-mono font-bold",
                                remainingTime < 60 ? "text-red-500" : "text-primary"
                            )}>
                                {formatTime(remainingTime)}
                            </span>
                        </p>
                    )}
                </div>

                {/* Champs OTP */}
                <div className="flex justify-center gap-2 sm:gap-3">
                    {otp.map((digit, index) => (
                        <Input
                            key={index}
                            ref={(el) => { inputRefs.current[index] = el; }}
                            type="text"
                            inputMode="numeric"
                            maxLength={1}
                            value={digit}
                            onChange={(e) => handleChange(index, e.target.value)}
                            onKeyDown={(e) => handleKeyDown(index, e)}
                            onPaste={handlePaste}
                            disabled={isVerifying || isExpired}
                            className={cn(
                                "w-10 h-12 sm:w-12 sm:h-14 text-center text-xl sm:text-2xl font-bold",
                                "focus:ring-2 focus:ring-primary focus:border-primary",
                                errors.otp && "border-red-500 focus:ring-red-500",
                                digit && "border-primary bg-primary/5"
                            )}
                        />
                    ))}
                </div>

                {/* Message d'erreur */}
                {errors.otp && (
                    <p className="text-sm text-red-500 text-center">{errors.otp}</p>
                )}
                {errors.resend && (
                    <p className="text-sm text-red-500 text-center">{errors.resend}</p>
                )}

                {/* Bouton de vérification */}
                <Button
                    type="button"
                    onClick={() => handleVerify()}
                    disabled={isVerifying || otp.some(d => !d) || isExpired}
                    className="w-full"
                >
                    {isVerifying ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Vérification...
                        </>
                    ) : (
                        'Vérifier le code'
                    )}
                </Button>

                {/* Bouton de renvoi */}
                <div className="text-center">
                    <p className="text-sm text-muted-foreground mb-2">
                        Vous n'avez pas reçu le code ?
                    </p>
                    <Button
                        type="button"
                        variant="ghost"
                        onClick={handleResend}
                        disabled={isResending || (!canResend && resendCooldown > 0)}
                        className="text-primary hover:text-primary/80"
                    >
                        {isResending ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Envoi en cours...
                            </>
                        ) : resendCooldown > 0 ? (
                            <>
                                <RefreshCw className="mr-2 h-4 w-4" />
                                Renvoyer dans {resendCooldown}s
                            </>
                        ) : (
                            <>
                                <RefreshCw className="mr-2 h-4 w-4" />
                                Renvoyer le code
                            </>
                        )}
                    </Button>
                </div>

                {/* Lien retour */}
                <div className="text-center pt-4 border-t">
                    <Link
                        href={route('register')}
                        className="text-sm text-muted-foreground hover:text-primary inline-flex items-center gap-1"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Retour à l'inscription
                    </Link>
                </div>
            </div>
        </AuthLayout>
    );
}
