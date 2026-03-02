import { useConfig } from '../../context/ConfigContext';
import GlassCard from '../ui/GlassCard';
import FormField from '../ui/FormField';
import { Plus, Trash2, KeyRound } from 'lucide-react';
import { useState } from 'react';

export default function AuthSection() {
    const { config, updateConfig } = useConfig();
    const profiles = config.auth?.profiles || {};

    const addProfile = () => {
        const name = `provider:default-${Date.now().toString(36).slice(-4)}`;
        updateConfig(prev => {
            if (!prev.auth) prev.auth = {};
            if (!prev.auth.profiles) prev.auth.profiles = {};
            prev.auth.profiles[name] = { provider: '', mode: 'api_key', email: '' };
            return prev;
        });
    };

    const updateProfile = (oldKey, newKey, data) => {
        updateConfig(prev => {
            if (oldKey !== newKey) delete prev.auth.profiles[oldKey];
            prev.auth.profiles[newKey] = data;
            return prev;
        });
    };

    const removeProfile = (key) => {
        updateConfig(prev => {
            delete prev.auth.profiles[key];
            return prev;
        });
    };

    return (
        <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
                <div>
                    <h2 style={{ fontSize: '1.4rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <KeyRound size={22} style={{ color: '#a78bfa' }} />
                        Authentication
                    </h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '4px' }}>
                        Manage authentication profiles for external services
                    </p>
                </div>
                <button onClick={addProfile} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', background: 'var(--accent-gradient)', borderRadius: 'var(--radius-md)', color: '#fff', fontSize: '0.85rem', fontWeight: 500 }}>
                    <Plus size={16} /> Add Profile
                </button>
            </div>

            {Object.entries(profiles).map(([key, profile]) => (
                <GlassCard key={key} style={{ marginBottom: '12px', padding: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                        <input
                            value={key}
                            onChange={e => updateProfile(key, e.target.value, profile)}
                            style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', fontWeight: 600, background: 'none', border: 'none', color: 'var(--accent-primary-hover)', padding: 0 }}
                            title="Profile key"
                        />
                        <button onClick={() => removeProfile(key)} style={{ padding: '6px', background: 'rgba(239,68,68,0.1)', borderRadius: 'var(--radius-sm)', color: 'var(--danger)' }}>
                            <Trash2 size={14} />
                        </button>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                        <FormField label="Provider">
                            <input value={profile.provider || ''} onChange={e => updateProfile(key, key, { ...profile, provider: e.target.value })} placeholder="google" />
                        </FormField>
                        <FormField label="Mode">
                            <select value={profile.mode || 'api_key'} onChange={e => updateProfile(key, key, { ...profile, mode: e.target.value })}>
                                <option value="api_key">API Key</option>
                                <option value="oauth">OAuth</option>
                                <option value="token">Token</option>
                            </select>
                        </FormField>
                        <FormField label="Email">
                            <input value={profile.email || ''} onChange={e => updateProfile(key, key, { ...profile, email: e.target.value })} placeholder="user@example.com" />
                        </FormField>
                    </div>
                </GlassCard>
            ))}

            {Object.keys(profiles).length === 0 && (
                <GlassCard style={{ textAlign: 'center', padding: '40px' }}>
                    <KeyRound size={36} style={{ color: 'var(--text-muted)', margin: '0 auto 12px' }} />
                    <p style={{ color: 'var(--text-secondary)' }}>No authentication profiles configured</p>
                </GlassCard>
            )}
        </div>
    );
}
