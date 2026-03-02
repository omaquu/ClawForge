import { useConfig } from '../../context/ConfigContext';
import GlassCard from '../ui/GlassCard';
import FormField from '../ui/FormField';
import { Server, Shield, Layout, Globe } from 'lucide-react';

export default function GatewaySection() {
    const { config, updateConfig } = useConfig();
    const gw = config.gateway || {};
    const auth = gw.auth || {};
    const ui = gw.controlUi || {};
    const ts = gw.tailscale || {};

    const isFunnel = ts.mode === 'funnel';
    const isServeOrFunnel = ts.mode === 'serve' || ts.mode === 'funnel';

    return (
        <div>
            <div style={{ marginBottom: '24px' }}>
                <h2 style={{ fontSize: '1.4rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Server size={22} style={{ color: 'var(--accent-primary)' }} />
                    Gateway
                </h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '4px' }}>
                    Configure the gateway server, authentication, and Tailscale
                </p>
            </div>

            <GlassCard style={{ marginBottom: '16px' }}>
                <h3 style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Server size={15} /> Connection
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                    <FormField label="Mode">
                        <select
                            value={gw.mode || 'local'}
                            onChange={e => updateConfig('gateway.mode', e.target.value)}
                        >
                            <option value="local">Local</option>
                            <option value="remote">Remote</option>
                            <option value="hybrid">Hybrid</option>
                        </select>
                    </FormField>
                    <FormField label="Bind" hint={gw.bind === 'tailnet' ? 'Direct Tailnet bind — no HTTPS, no Serve/Funnel' : gw.bind === 'auto' ? 'Prefers loopback; use "tailnet" for Tailnet-only' : undefined}>
                        <select
                            value={gw.bind || 'loopback'}
                            onChange={e => updateConfig('gateway.bind', e.target.value)}
                        >
                            <option value="loopback">Loopback (127.0.0.1)</option>
                            <option value="all">All Interfaces (0.0.0.0)</option>
                            <option value="tailnet">Tailnet</option>
                            <option value="auto">Auto</option>
                        </select>
                    </FormField>
                    <FormField label="Port">
                        <input
                            type="number"
                            value={gw.port || 18789}
                            onChange={e => updateConfig('gateway.port', parseInt(e.target.value) || 0)}
                            min={1}
                            max={65535}
                        />
                    </FormField>
                </div>
            </GlassCard>

            <GlassCard style={{ marginBottom: '16px' }}>
                <h3 style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Shield size={15} /> Authentication
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <FormField label="Auth Mode">
                        <select
                            value={auth.mode || 'none'}
                            onChange={e => updateConfig('gateway.auth.mode', e.target.value)}
                        >
                            <option value="none">None</option>
                            <option value="token">Token</option>
                            <option value="password">Password</option>
                        </select>
                    </FormField>
                    {auth.mode === 'token' && (
                        <FormField label="Token">
                            <input
                                type="password"
                                value={auth.token || ''}
                                onChange={e => updateConfig('gateway.auth.token', e.target.value)}
                                placeholder="Enter auth token"
                            />
                        </FormField>
                    )}
                    {auth.mode === 'password' && (
                        <FormField label="Password">
                            <input
                                type="password"
                                value={auth.password || ''}
                                onChange={e => updateConfig('gateway.auth.password', e.target.value)}
                                placeholder="Enter password"
                            />
                        </FormField>
                    )}
                </div>
                {isFunnel && auth.mode !== 'password' && (
                    <div style={{
                        marginTop: '12px', padding: '10px 14px',
                        background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)',
                        borderRadius: 'var(--radius-sm)', fontSize: '0.75rem', color: '#f87171',
                        display: 'flex', alignItems: 'center', gap: '8px'
                    }}>
                        ⚠️ <strong>Funnel mode requires "password" auth</strong> to avoid public exposure. Change auth mode to "password" or switch Tailscale mode.
                    </div>
                )}
            </GlassCard>

            {/* Tailscale */}
            <GlassCard style={{ marginBottom: '16px' }}>
                <h3 style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Globe size={15} /> Tailscale
                </h3>
                <p style={{
                    fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '14px',
                    padding: '8px 12px', background: 'var(--surface-1)', borderRadius: 'var(--radius-sm)',
                    border: 'var(--glass-border)', lineHeight: 1.5
                }}>
                    Serve/Funnel requires the <code style={{ color: 'var(--accent-primary-hover)' }}>tailscale</code> CLI to be installed and logged in.
                    Serve/Funnel only expose the Gateway control UI + WS endpoint.
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <FormField label="Mode" hint="off = disabled, serve = local Tailnet, funnel = public internet">
                        <select
                            value={ts.mode || 'off'}
                            onChange={e => updateConfig('gateway.tailscale.mode', e.target.value)}
                        >
                            <option value="off">Off</option>
                            <option value="serve">Serve (Tailnet only)</option>
                            <option value="funnel">Funnel (public)</option>
                        </select>
                    </FormField>
                    <FormField label="Reset on Exit" hint="Undo tailscale serve/funnel config on shutdown">
                        <select
                            value={ts.resetOnExit ? 'true' : 'false'}
                            onChange={e => updateConfig('gateway.tailscale.resetOnExit', e.target.value === 'true')}
                        >
                            <option value="false">No</option>
                            <option value="true">Yes</option>
                        </select>
                    </FormField>
                </div>

                {isServeOrFunnel && (
                    <div style={{
                        marginTop: '14px', padding: '10px 14px',
                        background: 'rgba(99,102,241,0.06)', border: '1px solid rgba(99,102,241,0.2)',
                        borderRadius: 'var(--radius-sm)', fontSize: '0.72rem', color: 'var(--text-secondary)',
                        lineHeight: 1.6
                    }}>
                        <strong>💡 Notes:</strong>
                        <ul style={{ margin: '6px 0 0 16px', padding: 0 }}>
                            {ts.mode === 'funnel' && (
                                <li style={{ color: '#f87171' }}>Funnel refuses to start unless auth mode is <strong>password</strong></li>
                            )}
                            <li>Nodes connect over the same Gateway WS endpoint</li>
                            <li>Use <code style={{ color: 'var(--accent-primary-hover)' }}>gateway.bind: "tailnet"</code> for direct Tailnet bind (no HTTPS, no Serve/Funnel)</li>
                            {ts.resetOnExit && <li>Tailscale config will be undone on shutdown</li>}
                        </ul>
                    </div>
                )}
            </GlassCard>

            <GlassCard>
                <h3 style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Layout size={15} /> Control UI
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <FormField label="Enabled">
                        <select
                            value={ui.enabled !== false ? 'true' : 'false'}
                            onChange={e => updateConfig('gateway.controlUi.enabled', e.target.value === 'true')}
                        >
                            <option value="true">Yes</option>
                            <option value="false">No</option>
                        </select>
                    </FormField>
                    <FormField label="Base Path">
                        <input
                            value={ui.basePath || '/'}
                            onChange={e => updateConfig('gateway.controlUi.basePath', e.target.value)}
                            placeholder="/"
                        />
                    </FormField>
                </div>
            </GlassCard>
        </div>
    );
}
