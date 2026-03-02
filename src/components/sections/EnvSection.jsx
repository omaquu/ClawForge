import { useConfig } from '../../context/ConfigContext';
import GlassCard from '../ui/GlassCard';
import FormField from '../ui/FormField';
import { Plus, Trash2, Variable } from 'lucide-react';

export default function EnvSection() {
    const { config, updateConfig } = useConfig();
    const env = config.env || {};
    const meta = config.meta || {};

    const envEntries = Object.entries(env);

    const addEnvVar = () => {
        updateConfig(prev => {
            if (!prev.env) prev.env = {};
            prev.env['NEW_VAR'] = '';
            return prev;
        });
    };

    const updateEnvKey = (oldKey, newKey, value) => {
        updateConfig(prev => {
            if (oldKey !== newKey) delete prev.env[oldKey];
            prev.env[newKey] = value;
            return prev;
        });
    };

    const removeEnvVar = (key) => {
        updateConfig(prev => {
            delete prev.env[key];
            return prev;
        });
    };

    return (
        <div>
            <div style={{ marginBottom: '24px' }}>
                <h2 style={{ fontSize: '1.4rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Variable size={22} style={{ color: '#f59e0b' }} />
                    Environment
                </h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '4px' }}>
                    Environment variables and metadata
                </p>
            </div>

            {/* Meta */}
            {(meta.lastTouchedVersion || meta.lastTouchedAt) && (
                <GlassCard style={{ marginBottom: '16px' }}>
                    <h3 style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '12px' }}>Meta</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                        <FormField label="Version">
                            <input value={meta.lastTouchedVersion || ''} onChange={e => updateConfig('meta.lastTouchedVersion', e.target.value)} placeholder="2026.2.6" />
                        </FormField>
                        <FormField label="Last Touched">
                            <input value={meta.lastTouchedAt || ''} onChange={e => updateConfig('meta.lastTouchedAt', e.target.value)} placeholder="ISO date" />
                        </FormField>
                    </div>
                </GlassCard>
            )}

            {/* Env Variables */}
            <GlassCard>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <h3 style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Variables</h3>
                    <button
                        onClick={addEnvVar}
                        style={{
                            display: 'flex', alignItems: 'center', gap: '4px',
                            fontSize: '0.7rem', padding: '4px 12px',
                            background: 'var(--accent-primary)', borderRadius: 'var(--radius-sm)',
                            color: '#fff',
                        }}
                    >
                        <Plus size={12} /> Add
                    </button>
                </div>
                {envEntries.map(([key, value], i) => (
                    <div key={i} style={{ display: 'flex', gap: '8px', marginBottom: '6px', alignItems: 'center' }}>
                        <input
                            value={key}
                            onChange={e => updateEnvKey(key, e.target.value, value)}
                            placeholder="VAR_NAME"
                            style={{ flex: 1, fontFamily: 'var(--font-mono)', fontSize: '0.8rem', fontWeight: 500 }}
                        />
                        <input
                            value={value}
                            onChange={e => updateEnvKey(key, key, e.target.value)}
                            placeholder="${ENV_VALUE}"
                            style={{ flex: 2, fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}
                        />
                        <button
                            onClick={() => removeEnvVar(key)}
                            style={{ padding: '6px', background: 'rgba(239,68,68,0.1)', borderRadius: 'var(--radius-sm)', color: 'var(--danger)', flexShrink: 0 }}
                        >
                            <Trash2 size={12} />
                        </button>
                    </div>
                ))}
                {envEntries.length === 0 && (
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', textAlign: 'center', padding: '16px' }}>
                        No environment variables. Click "Add" to create one.
                    </p>
                )}
            </GlassCard>
        </div>
    );
}
