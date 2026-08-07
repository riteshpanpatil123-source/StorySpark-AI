import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check } from 'lucide-react';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Badge } from '@/components/common/Badge';

export const PricingPage: React.FC = () => {
  const navigate = useNavigate();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  const plans = [
    {
      name: 'Free Creator',
      price: '$0',
      description: 'Perfect for students, hobbyists, and casual storytellers.',
      features: [
        '5,000 AI Tokens / month',
        '5 Story Generations / day',
        'Access to Character Vault (3 max)',
        'Standard Community Reading',
        'Basic Writing Coach',
      ],
      buttonText: 'Get Started Free',
      variant: 'outline' as const,
      popular: false,
    },
    {
      name: 'Pro Storyteller',
      price: billingCycle === 'monthly' ? '$19' : '$15',
      period: '/ month',
      description: 'Ideal for serious novelists, content creators, and scriptwriters.',
      features: [
        'Unlimited AI Story Generations',
        'Unlimited Character & World Lore Vaults',
        'Story-to-Comic & Screenplay Conversion',
        'DALL-E 3 Cover & Panel Image Gen',
        'OpenAI TTS Voice Narration',
        'Priority AI Job Processing',
      ],
      buttonText: 'Upgrade to Pro',
      variant: 'ai-gradient' as const,
      popular: true,
    },
    {
      name: 'Enterprise Studio',
      price: '$99',
      period: '/ month',
      description: 'Custom solutions for game studios, publishing houses & teams.',
      features: [
        'Everything in Pro Plan',
        'Multi-seat Team Workspaces',
        'Dedicated OpenAI Model Fine-tuning',
        'Custom Prompt Engineering Support',
        '99.9% Uptime SLA & SSO Auth',
        'Dedicated Account Manager',
      ],
      buttonText: 'Contact Enterprise',
      variant: 'secondary' as const,
      popular: false,
    },
  ];

  return (
    <div className="py-12 space-y-12 max-w-7xl mx-auto px-4 lg:px-8">
      <div className="text-center space-y-4">
        <Badge variant="amber" size="md">TRANSPARENT PRICING</Badge>
        <h1 className="text-4xl md:text-5xl font-extrabold font-display text-slate-900 dark:text-slate-100">
          Choose Your Creative Superpower
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm max-w-xl mx-auto">
          Start creating for free. Upgrade anytime to unlock unlimited AI generations, DALL-E art, and audio narration.
        </p>

        {/* Toggle */}
        <div className="flex items-center justify-center gap-3 pt-4">
          <span className={`text-xs font-medium ${billingCycle === 'monthly' ? 'text-slate-900 dark:text-slate-100' : 'text-slate-400'}`}>
            Monthly Billing
          </span>
          <button
            onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
            className="w-12 h-6 rounded-full bg-brand-500/20 p-1 transition-colors relative"
          >
            <div
              className={`w-4 h-4 rounded-full bg-brand-500 transition-transform ${
                billingCycle === 'yearly' ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
          <div className="flex items-center gap-1.5">
            <span className={`text-xs font-medium ${billingCycle === 'yearly' ? 'text-slate-900 dark:text-slate-100' : 'text-slate-400'}`}>
              Yearly Billing
            </span>
            <Badge variant="emerald" size="sm">Save 20%</Badge>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-6">
        {plans.map((plan, idx) => (
          <Card
            key={idx}
            className={`flex flex-col justify-between p-8 relative ${
              plan.popular ? 'border-brand-500 shadow-glow-primary glass-panel' : ''
            }`}
          >
            {plan.popular && (
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                <Badge variant="brand" size="sm">MOST POPULAR</Badge>
              </div>
            )}

            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold font-display text-slate-900 dark:text-slate-100">
                  {plan.name}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  {plan.description}
                </p>
              </div>

              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-extrabold font-display text-slate-900 dark:text-slate-100">
                  {plan.price}
                </span>
                {plan.period && (
                  <span className="text-xs text-slate-400">{plan.period}</span>
                )}
              </div>

              <div className="space-y-2.5 pt-4 border-t border-slate-100 dark:border-slate-800">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider font-mono">Included Features</p>
                {plan.features.map((feature, fIdx) => (
                  <div key={fIdx} className="flex items-center gap-2.5 text-xs text-slate-700 dark:text-slate-300">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-8">
              <Button
                variant={plan.variant}
                className="w-full"
                onClick={() => navigate('/register')}
              >
                {plan.buttonText}
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
