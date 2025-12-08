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
        className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300"
      >
        {label}
      </label>
      <textarea
        id={id}
        rows={4}
        className="block p-3 w-full text-sm text-gray-900 bg-white rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500:ring-indigo-400 focus:border-indigo-500:border-indigo-400 placeholder-gray-400 transition-all dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-indigo-500 dark:focus:border-indigo-500"
        placeholder="En quoi puis-je vous aider ?"
        {...props}
      ></textarea>
    </div>
  );
};
