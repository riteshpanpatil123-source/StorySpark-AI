import React, { useState } from 'react';
import { ChevronDown, Sparkles } from 'lucide-react';
import { Card } from '@/components/common/Card';
import { Badge } from '@/components/common/Badge';

export const FAQPage: React.FC = () => {
  const faqs = [
    {
      q: 'Who owns the copyright to AI-generated stories created on StorySpark?',
      a: 'You do! All content generated using your prompts and accounts belongs entirely to you. You retain 100% intellectual property rights to publish, commercialize, or sell your stories.',
    },
    {
      q: 'Does StorySpark AI train AI models on my private story drafts?',
      a: 'No. We strictly enforce data privacy. Your private story drafts, character vaults, and world lore are never used to train public LLMs or shared with third parties.',
    },
    {
      q: 'How does the AI Writing Coach work?',
      a: 'The AI Writing Coach scans your chapter draft for readability, passive voice, grammar issues, and character dialogue consistency, suggesting real-time improvements.',
    },
    {
      q: 'Can I export my stories as scripts or comic books?',
      a: 'Yes! Pro and Enterprise users can convert any story into formatted Hollywood screenplay scripts or visual comic panel descriptions with DALL-E image prompts.',
    },
    {
      q: 'What happens when I run out of monthly AI tokens?',
      a: 'Free users receive 5,000 tokens every month. You can upgrade to Pro at any time for unlimited story generation and priority processing speed.',
    },
  ];

  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <div className="py-12 space-y-12 max-w-4xl mx-auto px-4">
      <div className="text-center space-y-4">
        <Badge variant="cyan" size="md">HELP CENTER</Badge>
        <h1 className="text-4xl font-bold font-display text-slate-900 dark:text-slate-100">
          Frequently Asked Questions
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm">
          Everything you need to know about StorySpark AI features, licensing, and security.
        </p>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, idx) => (
          <Card
            key={idx}
            className="p-5 cursor-pointer transition-colors"
            onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100 font-display">
                {faq.q}
              </h3>
              <ChevronDown
                className={`w-5 h-5 text-slate-400 transition-transform ${
                  openIdx === idx ? 'rotate-180 text-brand-500' : ''
                }`}
              />
            </div>

            {openIdx === idx && (
              <p className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {faq.a}
              </p>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
};
