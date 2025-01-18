"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

interface PasswordInputProps {
  id: string;
  text?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
}

export function PasswordInput({
  id,
  text = "Password",
  value,
  onChange,
  placeholder = "••••••••",
  required = true,
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className="grid gap-2">
      <div className="flex items-center">
        <Label htmlFor={id}>{text}</Label>
      </div>
      <div className="relative">
        <Input
          id={id}
          type={showPassword ? "text" : "password"}
          value={value}
          onChange={onChange}
          required={required}
          placeholder={placeholder}
        />
        <button
          type="button"
          onClick={togglePasswordVisibility}
          className="absolute right-2 top-1/2 transform -translate-y-1/2"
        >
          {showPassword ? <EyeOff /> : <Eye />}
        </button>
      </div>
    </div>
  );
}
