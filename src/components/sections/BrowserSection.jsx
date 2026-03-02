import { useConfig } from '../../context/ConfigContext';
import GlassCard from '../ui/GlassCard';
import FormField from '../ui/FormField';
import { Globe, Monitor, Camera } from 'lucide-react';

export default function BrowserSection() {
    const { config, updateConfig } = useConfig();
    const b = config.browser || {};
    const snap = b.snapshotDefaults || {};
    const set = (p, v) => updateConfig(`browser.${p}`, v);

    return (
        <div>
            <div style={{ marginBottom: '24px' }}>
                <h2 style={{ fontSize: '1.4rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Globe size={22} style={{ color: '#06b6d4' }} /> Browser
                </h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '4px' }}>Browser automation and CDP settings</p>
            </div>
            <GlassCard style={{ marginBottom: '16px' }}>
                <h3 style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '16px' }}><Monitor size={15} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 6 }} />Connection</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <FormField label="Evaluate Enabled">
                        <select value={b.evaluateEnabled !== false ? 'true' : 'false'} onChange={e => set('evaluateEnabled', e.target.value === 'true')}>
                            <option value="true">Yes</option><option value="false">No</option>
                        </select>
                    </FormField>
                    <FormField label="CDP URL">
                        <input value={b.cdpUrl || ''} onChange={e => set('cdpUrl', e.target.value)} placeholder="http://browser:9223" />
                    </FormField>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginTop: '12px' }}>
                    <FormField label="CDP Timeout (ms)">
                        <input type="number" value={b.remoteCdpTimeoutMs || 1500} onChange={e => set('remoteCdpTimeoutMs', parseInt(e.target.value) || 1500)} />
                    </FormField>
                    <FormField label="Handshake Timeout (ms)">
                        <input type="number" value={b.remoteCdpHandshakeTimeoutMs || 3000} onChange={e => set('remoteCdpHandshakeTimeoutMs', parseInt(e.target.value) || 3000)} />
                    </FormField>
                    <FormField label="Default Profile">
                        <input value={b.defaultProfile || ''} onChange={e => set('defaultProfile', e.target.value)} placeholder="openclaw" />
                    </FormField>
                </div>
            </GlassCard>
            <GlassCard>
                <h3 style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '16px' }}><Camera size={15} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 6 }} />Snapshot Defaults</h3>
                <FormField label="Mode">
                    <select value={snap.mode || 'efficient'} onChange={e => updateConfig('browser.snapshotDefaults.mode', e.target.value)}>
                        <option value="efficient">Efficient</option><option value="full">Full</option><option value="light">Light</option>
                    </select>
                </FormField>
            </GlassCard>
        </div>
    );
}
