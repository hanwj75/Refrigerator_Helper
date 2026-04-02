import type { KeyboardEvent } from "react";
import clsx from "clsx";
import type { RecipeDifficulty } from "@/types/ui";

type IngredientInputCardProps = {
  title: string;
  description: string;
  placeholder: string;
  hint: string;
  helper: string;
  clearLabel: string;
  primaryCta: string;
  secondaryCta: string;
  difficultyLabel: string;
  difficultyOptions: { value: RecipeDifficulty; label: string }[];
  selectedDifficulty: RecipeDifficulty;
  inputValue: string;
  tags: string[];
  examples: string[];
  onDifficultyChange: (difficulty: RecipeDifficulty) => void;
  onPrimaryAction: () => void;
  onSecondaryAction: () => void;
  onInputChange: (value: string) => void;
  onInputKeyDown: (event: KeyboardEvent<HTMLInputElement>) => void;
  onClearAll: () => void;
  onRemoveTag: (tag: string) => void;
};

export function IngredientInputCard({
  title,
  description,
  placeholder,
  hint,
  helper,
  clearLabel,
  primaryCta,
  secondaryCta,
  difficultyLabel,
  difficultyOptions,
  selectedDifficulty,
  inputValue,
  tags,
  examples,
  onDifficultyChange,
  onPrimaryAction,
  onSecondaryAction,
  onInputChange,
  onInputKeyDown,
  onClearAll,
  onRemoveTag,
}: IngredientInputCardProps) {
  return (
    <section className="relative overflow-hidden rounded-[2rem] border border-brand-100 bg-white px-5 py-6 shadow-[0_24px_80px_rgba(76,107,54,0.12)] sm:px-8 sm:py-8">
      <div className="absolute right-0 top-0 h-28 w-28 rounded-full bg-brand-50 blur-3xl" />
      <div className="relative">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="max-w-2xl">
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-700 text-xl text-white shadow-lg shadow-brand-200">
              +
            </span>
            <h2 className="mt-4 text-2xl font-semibold text-stone-900">{title}</h2>
            <p className="mt-2 text-sm leading-6 text-stone-600">{description}</p>
          </div>
          <button
            type="button"
            onClick={onClearAll}
            className="inline-flex items-center self-start rounded-full border border-stone-200 px-4 py-2 text-sm font-medium text-stone-500 transition hover:border-stone-300 hover:text-stone-900"
          >
            {clearLabel}
          </button>
        </div>

        <div className="mt-6 rounded-[1.75rem] border border-brand-200 bg-brand-50/50 p-3 sm:p-4">
          <div className="flex min-h-[76px] flex-wrap items-center gap-3 rounded-[1.25rem] border border-brand-300 bg-white px-3 py-3 shadow-inner shadow-brand-50 sm:px-4">
            {tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex max-w-full items-center gap-2 rounded-full border border-brand-200 bg-brand-50 px-3 py-2 text-sm font-medium text-brand-900"
              >
                <span className="max-w-[120px] truncate sm:max-w-[180px]">{tag}</span>
                <button
                  type="button"
                  onClick={() => onRemoveTag(tag)}
                  className="rounded-full p-1 text-brand-600 transition hover:bg-brand-100 hover:text-brand-900"
                  aria-label={`remove ${tag}`}
                >
                  x
                </button>
              </span>
            ))}

            <input
              value={inputValue}
              onChange={(event) => onInputChange(event.target.value)}
              onKeyDown={onInputKeyDown}
              placeholder={placeholder}
              className="min-w-[180px] flex-1 border-0 bg-transparent px-1 py-2 text-sm text-stone-800 outline-none placeholder:text-stone-400"
            />
          </div>

          <div className="mt-4 flex flex-col gap-3 text-sm text-stone-500 sm:flex-row sm:items-center sm:justify-between">
            <p>{hint}</p>
            <p>{helper}</p>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          {examples.map((example) => (
            <span
              key={example}
              className="rounded-full border border-stone-200 bg-stone-50 px-3 py-2 text-xs font-medium text-stone-600 sm:text-sm"
            >
              {example}
            </span>
          ))}
        </div>

        <div className="mt-6 rounded-[1.5rem] border border-stone-200 bg-stone-50/80 p-4">
          <p className="text-sm font-semibold text-stone-800">{difficultyLabel}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {difficultyOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => onDifficultyChange(option.value)}
                className={clsx(
                  "rounded-full px-4 py-2 text-sm font-medium transition-colors",
                  selectedDifficulty === option.value
                    ? "bg-brand-700 text-white"
                    : "bg-white text-stone-600 hover:bg-brand-50 hover:text-brand-800",
                )}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={onPrimaryAction}
            className="inline-flex items-center justify-center rounded-[1.25rem] bg-brand-700 px-5 py-4 text-base font-semibold text-white shadow-lg shadow-brand-200 transition hover:bg-brand-800"
          >
            {primaryCta}
          </button>
          <button
            type="button"
            onClick={onSecondaryAction}
            className={clsx(
              "inline-flex items-center justify-center rounded-[1.25rem] border px-5 py-4 text-base font-semibold transition",
              "border-brand-200 bg-white text-brand-800 hover:border-brand-300 hover:bg-brand-50",
            )}
          >
            {secondaryCta}
          </button>
        </div>
      </div>
    </section>
  );
}
