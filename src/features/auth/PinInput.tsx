import { useRef, useState, type KeyboardEvent } from "react";

type PinInputProps = {
  length?: number;
  disabled?: boolean;
  error?: boolean;
  onComplete: (pin: string) => void;
};

export function PinInput({ length = 4, disabled, error, onComplete }: PinInputProps) {
  const [digits, setDigits] = useState<string[]>(Array(length).fill(""));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  function updateDigit(index: number, value: string) {
    const digit = value.replace(/\D/g, "").slice(-1);
    const next = [...digits];
    next[index] = digit;
    setDigits(next);

    if (digit && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    if (next.every((d) => d !== "")) {
      const pin = next.join("");
      onComplete(pin);
      setTimeout(() => {
        setDigits(Array(length).fill(""));
        inputRefs.current[0]?.focus();
      }, 150);
    }
  }

  function handleKeyDown(index: number, e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  }

  return (
    <div className="flex gap-3 justify-center">
      {digits.map((digit, i) => (
        <input
          key={i}
          ref={(el) => {
            inputRefs.current[i] = el;
          }}
          type="password"
          inputMode="numeric"
          maxLength={1}
          value={digit}
          disabled={disabled}
          onChange={(e) => updateDigit(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          className={`w-14 h-14 text-center text-2xl font-bold rounded-2xl border-2 bg-secondary/10 text-foreground outline-none transition-colors focus:border-primary disabled:opacity-50 ${
            error ? "border-red-500" : "border-secondary/20"
          }`}
        />
      ))}
    </div>
  );
}
