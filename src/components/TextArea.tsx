'use client';

import { ComponentPropsWithoutRef, useId } from 'react';

type TextAreaProps = {
  label: string;
} & ComponentPropsWithoutRef<'textarea'>;

export const TextArea = ({ label, ...props }: TextAreaProps) => {
  const id = useId();

  return (
    <div className="">
      <label
        htmlFor={id}
        className="block mb-2 text-sm font-medium text-[#fdf6e3]"
      >
        {label}
      </label>
      <textarea
        id={id}
        rows={4}
        className="block p-2.5 w-full text-sm text-[#fdf6e3] bg-[#1e293b] rounded-lg border border-[#d4af37] focus:ring-2 focus:ring-[#d4af37] focus:border-[#d4af37] placeholder-[#94a3b8] transition-all"
        placeholder="En quoi puis-je vous aider ?"
        {...props}
      ></textarea>
    </div>
  );
};