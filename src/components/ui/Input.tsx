'use client';

import { ComponentPropsWithoutRef, useId, forwardRef } from 'react';
import { clsx } from 'clsx';

type InputProps = {
  label: string;
  error?: string;
  labelClassName?: string;
} & ComponentPropsWithoutRef<'input'>;

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className, labelClassName, ...props }, ref) => {
    const generatedId = useId();
    const id = props.id || generatedId;

    return (
      <div className="w-full">
        <label
          htmlFor={id}
          className={clsx(
            "block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300",
            labelClassName
          )}
        >
          {label}
        </label>
        <input
          id={id}
          ref={ref}
          className={clsx(
            "block p-3 w-full text-sm text-gray-900 bg-white rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-indigo-500 dark:focus:border-indigo-500",
            error && "border-red-500 focus:border-red-500 focus:ring-red-500",
            className
          )}
          {...props}
        />
        {error && (
          <p className="mt-1 text-sm text-red-500">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

