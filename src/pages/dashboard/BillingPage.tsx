import React from 'react';
import { CreditCard, Check } from 'lucide-react';
import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';
import { Badge } from '@/components/common/Badge';
import toast from 'react-hot-toast';

export const BillingPage: React.FC = () => {
  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-display text-slate-900 dark:text-slate-100 flex items-center gap-2">
            Billing & Token Subscription
            <CreditCard className="w-5 h-5 text-amber-500" />
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Manage your AI studio plan tier, token allocations, and monthly billing cycles.
          </p>
        </div>
      </div>

      {/* Usage Overview Widget */}
      <Card className="p-6 glass-panel border-amber-500/20 space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <Badge variant="amber" size="sm">PRO ANNUAL TIER</Badge>
              <span className="text-xs text-slate-400">Active until Aug 28, 2026</span>
            </div>
            <h2 className="text-xl font-bold font-display text-slate-900 dark:text-slate-100 mt-1">
              10,000 AI Tokens Monthly
            </h2>
          </div>
          <Button variant="outline" size="sm" onClick={() => toast.success('Billing receipt downloaded!')}>
            Download Receipt
          </Button>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-xs font-medium">
            <span className="text-slate-600 dark:text-slate-300">Monthly Usage</span>
            <span className="text-brand-500 font-bold">4,500 / 10,000 Tokens (45%)</span>
          </div>
          <div className="w-full h-3 rounded-full bg-slate-200 dark:bg-dark-700 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-brand-500 to-ai-spark rounded-full w-[45%]" />
          </div>
        </div>
      </Card>

      {/* Subscription Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
        <Card className="p-6 space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <Badge variant="cyan" size="sm">STARTER</Badge>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 font-display">$0 <span className="text-xs font-normal text-slate-400">/ mo</span></h3>
            <p className="text-xs text-slate-500">Perfect for exploring AI story generation.</p>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400 pt-2">
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> 1,000 Monthly Tokens</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> Standard AI Models</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> Story Library Storage</li>
            </ul>
          </div>
          <Button variant="outline" className="w-full">Current Tier</Button>
        </Card>

        <Card className="p-6 space-y-4 flex flex-col justify-between border-brand-500/50 shadow-glow-primary glass-panel">
          <div className="space-y-3">
            <Badge variant="amber" size="sm">PRO CREATOR</Badge>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 font-display">$19 <span className="text-xs font-normal text-slate-400">/ mo</span></h3>
            <p className="text-xs text-slate-500">Designed for active writers and storytellers.</p>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400 pt-2">
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> 10,000 Monthly Tokens</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> High-Speed Generation</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> DALL-E 3 Cover Art</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> Audio Narration TTS</li>
            </ul>
          </div>
          <Button variant="ai-gradient" className="w-full">Upgrade / Renewal Active</Button>
        </Card>

        <Card className="p-6 space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <Badge variant="emerald" size="sm">ENTERPRISE</Badge>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 font-display">$49 <span className="text-xs font-normal text-slate-400">/ mo</span></h3>
            <p className="text-xs text-slate-500">Unlimited creative studio for publishing teams.</p>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400 pt-2">
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> Unlimited AI Tokens</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> Priority API Queue</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> Team Collaboration</li>
            </ul>
          </div>
          <Button variant="outline" className="w-full" onClick={() => toast.success('Contacting sales team...')}>Contact Sales</Button>
        </Card>
      </div>
    </div>
  );
};
