import React, { useState } from 'react';
import Layout from '../components/Layout';
import { Card, CardBody, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useAuthStore } from '../store/authStore';
import toast from 'react-hot-toast';

const SettingsPage: React.FC = () => {
  const { user } = useAuthStore();
  const [isPublic, setIsPublic] = useState(user?.is_public || false);
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveSettings = async () => {
    setIsSaving(true);
    try {
      // In a real app, call API to save settings
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success('Settings saved successfully');
    } catch (error) {
      toast.error('Failed to save settings');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Settings</h1>
          <p className="text-slate-400 mt-2">Manage your account preferences and profile visibility.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Sidebar Nav (Settings specific) */}
          <div className="space-y-2">
            <button className="w-full text-left px-4 py-3 rounded-xl bg-blue-600/10 text-blue-500 font-medium">
              Profile
            </button>
            <button className="w-full text-left px-4 py-3 rounded-xl text-slate-400 hover:bg-white/5 transition-colors">
              Account Security
            </button>
            <button className="w-full text-left px-4 py-3 rounded-xl text-slate-400 hover:bg-white/5 transition-colors">
              Notifications
            </button>
          </div>

          {/* Settings Content */}
          <div className="md:col-span-2 space-y-6">
            <Card bordered>
              <CardHeader>
                <h2 className="text-lg font-bold text-white">Basic Information</h2>
              </CardHeader>
              <CardBody className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Input label="First Name" defaultValue={user?.display_name?.split(' ')[0]} />
                  <Input label="Last Name" defaultValue={user?.display_name?.split(' ').slice(1).join(' ')} />
                </div>
                <Input label="Email Address" defaultValue={user?.email} disabled />
                <Input label="Bio" placeholder="Tell recruiters about yourself..." />
              </CardBody>
            </Card>

            {user?.role === 'student' && (
              <Card bordered>
                <CardHeader>
                  <h2 className="text-lg font-bold text-white">Privacy & Visibility</h2>
                  <p className="text-sm text-slate-400 mt-1">Control who can see your verified trust score.</p>
                </CardHeader>
                <CardBody>
                  <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10">
                    <div>
                      <h3 className="font-medium text-white">Public Profile</h3>
                      <p className="text-sm text-slate-400 mt-1">Allow recruiters to find you in Discovery.</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="sr-only peer" 
                        checked={isPublic}
                        onChange={(e) => setIsPublic(e.target.checked)}
                      />
                      <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </CardBody>
              </Card>
            )}

            <div className="flex justify-end">
              <Button variant="primary" onClick={handleSaveSettings} isLoading={isSaving}>
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SettingsPage;
