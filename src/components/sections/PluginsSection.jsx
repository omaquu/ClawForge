import { useConfig } from '../../context/ConfigContext';
import GlassCard from '../ui/GlassCard';
import FormField from '../ui/FormField';
import { Plus, Trash2, Plug, Wrench } from 'lucide-react';

export default function PluginsSection() {
    const { config, updateConfig } = useConfig();
    const entries = config.plugins?.entries || {};
    const tools = config.tools || {};
    const msgTools = tools.message || {};
    const cross = msgTools.crossContext || {};

    const addPlugin = () => {
        const name = `plugin-${Date.now().toString(36).slice(-4)}`;
        updateConfig(prev => {
            if (!prev.plugins) prev.plugins = {};
            if (!prev.plugins.entries) prev.plugins.entries = {};
            prev.plugins.entries[name] = { enabled: true };
            return prev;
        });
    };

    const updatePlugin = (oldKey, newKey, data) => {
        updateConfig(prev => {
            if (oldKey !== newKey) delete prev.plugins.entries[oldKey];
            prev.plugins.entries[newKey] = data;
            return prev;
        });
    };

    const removePlugin = (key) => {
        updateConfig(prev => { delete prev.plugins.entries[key]; return prev; });
    };

    return (
        <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
                <div>
                    <h2 style={{ fontSize: '1.4rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Plug size={22} style={{ color: '#34d399' }} /> Plugins & Tools
                    </h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '4px' }}>Manage plugins and tool settings</p>
                </div>
                <button onClick={addPlugin} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', background: 'var(--accent-gradient)', borderRadius: 'var(--radius-md)', color: '#fff', fontSize: '0.85rem', fontWeight: 500 }}>
                    <Plus size={16} /> Add Plugin
                </button>
            </div>

            {Object.entries(entries).map(([key, plugin]) => (
                <GlassCard key={key} style={{ marginBottom: '10px', padding: '14px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Plug size={14} style={{ color: plugin.enabled ? '#34d399' : 'var(--text-muted)' }} />
                        <input value={key} onChange={e => updatePlugin(key, e.target.value, plugin)} style={{ flex: 1, fontFamily: 'var(--font-mono)', fontSize: '0.85rem', fontWeight: 600, background: 'none', border: 'none', color: 'var(--text-primary)', padding: 0 }} />
                        <select value={plugin.enabled ? 'true' : 'false'} onChange={e => updatePlugin(key, key, { ...plugin, enabled: e.target.value === 'true' })} style={{ fontSize: '0.75rem', padding: '3px 8px', width: 'auto' }}>
                            <option value="true">Enabled</option><option value="false">Disabled</option>
                        </select>
                        <button onClick={() => removePlugin(key)} style={{ padding: '5px', background: 'rgba(239,68,68,0.1)', borderRadius: 'var(--radius-sm)', color: 'var(--danger)' }}>
                            <Trash2 size={12} />
                        </button>
                    </div>
                </GlassCard>
            ))}

            {Object.keys(entries).length === 0 && (
                <GlassCard style={{ textAlign: 'center', padding: '32px' }}>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>No plugins. Click "Add Plugin" to enable one.</p>
                </GlassCard>
            )}

            <GlassCard style={{ marginTop: '20px' }}>
                <h3 style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '14px' }}>
                    <Wrench size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 6 }} />Tool Settings
                </h3>
                <FormField label="Cross-Context: Allow Across Providers">
                    <select value={cross.allowAcrossProviders ? 'true' : 'false'} onChange={e => updateConfig(prev => { if (!prev.tools) prev.tools = {}; if (!prev.tools.message) prev.tools.message = {}; if (!prev.tools.message.crossContext) prev.tools.message.crossContext = {}; prev.tools.message.crossContext.allowAcrossProviders = e.target.value === 'true'; return prev; })}>
                        <option value="true">Yes</option><option value="false">No</option>
                    </select>
                </FormField>
            </GlassCard>
        </div>
    );
}
