import React, { useState } from 'react';
import { Settings, Save, Mail } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/hooks/reduxHooks';
import { setUser } from '@/store/slices/authSlice';
import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';
import { Input } from '@/components/common/Input';
import { Avatar } from '@/components/common/Avatar';
import toast from 'react-hot-toast';

export const ProfileSettingsPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector((state) => state.auth.user);

  const [displayName, setDisplayName] = useState(currentUser?.displayName || 'Alex Rivers');
  const [username, setUsername] = useState(currentUser?.username || 'alex_rivers');
  const [email, setEmail] = useState(currentUser?.email || 'author@storyspark.ai');
  const [bio, setBio] = useState('AI Creative Pilot & Sci-Fi Author.');

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentUser) {
      const updated = {
        ...currentUser,
        displayName,
        username,
        email,
      };
      dispatch(setUser(updated));
      toast.success('Profile settings updated successfully!');
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-display text-slate-900 dark:text-slate-100 flex items-center gap-2">
            Account & Profile Settings
            <Settings className="w-5 h-5 text-brand-500" />
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Manage your personal profile details, preferences, and studio security credentials.
          </p>
        </div>
      </div>

      <Card className="p-6 glass-panel space-y-6">
        <div className="flex items-center gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
          <Avatar name={displayName} src={currentUser?.avatarUrl} size="lg" />
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 font-display">{displayName}</h3>
            <p className="text-xs text-slate-500">{email}</p>
          </div>
        </div>

        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Display Name" value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
            <Input label="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
          </div>

          <Input label="Email Address" type="email" value={email} onChange={(e) => setEmail(e.target.value)} leftIcon={<Mail className="w-4 h-4" />} />

          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300">Author Bio</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={3}
              className="w-full rounded-lg text-xs bg-white dark:bg-dark-800 border border-slate-300 dark:border-slate-700 p-3 text-slate-900 dark:text-slate-100 focus:outline-none"
            />
          </div>

          <div className="flex justify-end pt-2">
            <Button type="submit" variant="ai-gradient" leftIcon={<Save className="w-4 h-4" />}>
              Save Profile Changes
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};
