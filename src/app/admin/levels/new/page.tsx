'use client';

import { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { levelSchema } from '@/lib/validations/level';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import Link from 'next/link';

// Form schema matching the database structure
const formSchema = z.object({
  title: z.string().min(3, "Le titre doit faire au moins 3 caractères"),
  description: z.string().optional(),
  // Use z.number with string coercion handled by react-hook-form's valueAsNumber or Zod's coerce
  // Here we keep coerce but we need to ensure the types match for RHF
  order_index: z.coerce.number().min(1, "L'ordre doit être au moins 1"),
  content: z.string().optional(), // Textarea input for JSON
  is_active: z.boolean(),
});

type FormInput = z.infer<typeof formSchema>;

export default function CreateLevelPage() {
  const { t } = useLanguage();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      order_index: 1,
      is_active: false,
      content: "{}",
    },
  });

  const onSubmit: SubmitHandler<FormInput> = async (data) => {
    setError(null);
    setSuccess(false);

    try {
      // Validate JSON content if provided
      let parsedContent = {};
      if (data.content) {
        try {
          parsedContent = JSON.parse(data.content);
        } catch (e) {
          setError("Le champ Contenu doit être un JSON valide");
          return;
        }
      }

      const response = await fetch('/api/levels', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          content: parsedContent,
        }),
      });

      if (!response.ok) {
        const result = await response.json();
        const errorMessage = result.message || result.error || 'Erreur lors de la création du niveau';
        const errorDetails = result.details ? ` (${result.details})` : '';
        throw new Error(errorMessage + errorDetails);
      }

      setSuccess(true);
      reset();
      router.refresh();
      // Optional: Redirect to list or stay
      // router.push('/admin/levels'); 
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans relative overflow-hidden flex flex-col">
       {/* Background */}
      <div className="absolute inset-0 z-0 bg-gray-900">
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-900 to-gray-800 opacity-50"></div>
      </div>

      <header className="relative z-10 p-6 border-b border-white/10 backdrop-blur-md">
        <div className="max-w-2xl mx-auto">
          <Link 
            href="/immersive/immersive-rpg"
            className="inline-flex items-center gap-2 px-3 py-2 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-indigo-500/50 rounded-lg text-gray-300 hover:text-white text-sm transition-colors mb-4"
          >
            ← {t('admin.backToHome')}
          </Link>
          <div className="text-center">
            <h1 className="text-3xl font-serif text-indigo-300 mb-2">
              {t('admin.title')}
            </h1>
            <p className="text-gray-400 text-sm">{t('admin.subtitle')}</p>
          </div>
        </div>
      </header>

      <div className="relative z-10 max-w-2xl mx-auto p-6 w-full">
        {error && (
          <div className="bg-red-900/50 text-red-200 p-4 rounded-lg mb-6 border border-red-500/50">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-900/50 text-green-200 p-4 rounded-lg mb-6 border border-green-500/50">
            ✅ {t('admin.success')}
          </div>
        )}

        <div className="bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm shadow-2xl p-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-300">
                        {t('admin.form.titleLabel')}
                    </label>
                    <input
                        type="text"
                        placeholder={t('admin.form.titlePlaceholder')}
                        className="block p-3 w-full text-white bg-gray-800/50 rounded-lg border border-white/10 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 placeholder-gray-500 transition-all"
                        {...register('title')}
                    />
                    {errors.title && <p className="text-sm text-red-400">{errors.title.message}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-300">
                          {t('admin.form.orderLabel')}
                      </label>
                      <input
                          type="number"
                          className="block p-3 w-full text-white bg-gray-800/50 rounded-lg border border-white/10 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 placeholder-gray-500 transition-all"
                          placeholder={t('admin.form.orderPlaceholder')}
                          {...register('order_index')}
                      />
                      {errors.order_index && <p className="text-sm text-red-400">{errors.order_index.message}</p>}
                  </div>

                   <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            {t('admin.form.statusLabel')}
                        </label>
                        <div className="flex items-center space-x-3 bg-gray-800/30 p-3 rounded-lg border border-white/5 h-[46px]">
                            <input
                                type="checkbox"
                                id="is_active"
                                className="w-5 h-5 text-indigo-600 bg-gray-800 border-gray-600 rounded focus:ring-indigo-500 cursor-pointer"
                                {...register('is_active')}
                            />
                            <label htmlFor="is_active" className="text-sm font-medium text-gray-300 cursor-pointer whitespace-nowrap">
                                {t('admin.form.activeCheckbox')}
                            </label>
                        </div>
                   </div>
                </div>

                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-300">
                        {t('admin.form.descriptionLabel')}
                    </label>
                    <textarea
                        className="block p-3 w-full text-white bg-gray-800/50 rounded-lg border border-white/10 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 placeholder-gray-500 transition-all resize-none"
                        rows={3}
                        placeholder={t('admin.form.descriptionPlaceholder')}
                        {...register('description')}
                    />
                    {errors.description && <p className="text-sm text-red-400">{errors.description.message}</p>}
                </div>

                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-300">
                        {t('admin.form.contentLabel')}
                    </label>
                    <textarea
                        className="block p-3 w-full font-mono text-xs text-indigo-200 bg-gray-900/80 rounded-lg border border-white/10 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 placeholder-gray-600 transition-all resize-none"
                        rows={8}
                        placeholder={t('admin.form.contentPlaceholder')}
                        {...register('content')}
                    />
                    <p className="text-xs text-gray-500">
                        {t('admin.form.contentHint')}
                    </p>
                    {errors.content && <p className="text-sm text-red-400">{errors.content.message}</p>}
                </div>

                <Button 
                    type="submit" 
                    isLoading={isSubmitting} 
                    className="w-full bg-indigo-600 hover:bg-indigo-500 text-white border-none py-3 text-lg rounded-lg transition-colors"
                >
                    {isSubmitting ? t('admin.form.submitting') : t('admin.form.submitButton')}
                </Button>
            </form>
        </div>
      </div>
    </div>
  );
}
