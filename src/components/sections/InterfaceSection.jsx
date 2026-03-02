import { useConfig } from '../../context/ConfigContext';
import GlassCard from '../ui/GlassCard';
import FormField from '../ui/FormField';
import { Palette, Volume2, MessageSquare, Terminal } from 'lucide-react';

export default function InterfaceSection() {
    const { config, updateConfig } = useConfig();
    const ui = config.ui || {};
    const assistant = ui.assistant || {};
    const msgs = config.messages || {};
    const inbound = msgs.inbound || {};
    const tts = msgs.tts || {};
    const edge = tts.edge || {};
    const cmds = config.commands || {};

    return (
        <div>
            <div style={{ marginBottom: '24px' }}>
                <h2 style={{ fontSize: '1.4rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Palette size={22} style={{ color: '#f472b6' }} /> Interface
                </h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '4px' }}>UI appearance, messages, TTS, and commands</p>
            </div>

            <GlassCard style={{ marginBottom: '16px' }}>
                <h3 style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
                    <Palette size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 6 }} />Appearance
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <FormField label="Seam Color">
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                            <input type="color" value={ui.seamColor || '#FF8C00'} onChange={e => updateConfig('ui.seamColor', e.target.value)} style={{ width: '40px', height: '34px', padding: '2px', cursor: 'pointer' }} />
                            <input value={ui.seamColor || '#FF8C00'} onChange={e => updateConfig('ui.seamColor', e.target.value)} style={{ flex: 1, fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }} />
                        </div>
                    </FormField>
                    <FormField label="Assistant Name">
                        <input value={assistant.name || ''} onChange={e => updateConfig('ui.assistant.name', e.target.value)} placeholder="Pina 🥧" />
                    </FormField>
                </div>
            </GlassCard>

            <GlassCard style={{ marginBottom: '16px' }}>
                <h3 style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
                    <MessageSquare size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 6 }} />Messages
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <FormField label="Inbound Debounce (ms)">
                        <input type="number" value={inbound.debounceMs || 8000} onChange={e => updateConfig('messages.inbound.debounceMs', parseInt(e.target.value) || 8000)} />
                    </FormField>
                    <FormField label="Ack Reaction Scope">
                        <select value={msgs.ackReactionScope || 'group-mentions'} onChange={e => updateConfig('messages.ackReactionScope', e.target.value)}>
                            <option value="group-mentions">Group Mentions</option>
                            <option value="all">All</option>
                            <option value="none">None</option>
                        </select>
                    </FormField>
                </div>
            </GlassCard>

            <GlassCard style={{ marginBottom: '16px' }}>
                <h3 style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
                    <Volume2 size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 6 }} />Text-to-Speech
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                    <FormField label="Auto TTS">
                        <select value={tts.auto || 'off'} onChange={e => updateConfig('messages.tts.auto', e.target.value)}>
                            <option value="off">Off</option><option value="on">On</option><option value="auto">Auto</option>
                        </select>
                    </FormField>
                    <FormField label="Provider">
                        <select value={tts.provider || 'edge'} onChange={e => updateConfig('messages.tts.provider', e.target.value)}>
                            <option value="edge">Edge</option><option value="google">Google</option><option value="elevenlabs">ElevenLabs</option>
                        </select>
                    </FormField>
                    <FormField label="Edge Enabled">
                        <select value={edge.enabled !== false ? 'true' : 'false'} onChange={e => updateConfig('messages.tts.edge.enabled', e.target.value === 'true')}>
                            <option value="true">Yes</option><option value="false">No</option>
                        </select>
                    </FormField>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '12px' }}>
                    <FormField label="Voice">
                        <input value={edge.voice || ''} onChange={e => updateConfig('messages.tts.edge.voice', e.target.value)} placeholder="fi-FI-SelmaNeural" />
                    </FormField>
                    <FormField label="Language">
                        <input value={edge.lang || ''} onChange={e => updateConfig('messages.tts.edge.lang', e.target.value)} placeholder="fi-FI" />
                    </FormField>
                </div>
            </GlassCard>

            <GlassCard>
                <h3 style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
                    <Terminal size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 6 }} />Commands
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                    <FormField label="Native">
                        <select value={cmds.native || 'auto'} onChange={e => updateConfig('commands.native', e.target.value)}>
                            <option value="auto">Auto</option><option value="on">On</option><option value="off">Off</option>
                        </select>
                    </FormField>
                    <FormField label="Native Skills">
                        <select value={cmds.nativeSkills || 'auto'} onChange={e => updateConfig('commands.nativeSkills', e.target.value)}>
                            <option value="auto">Auto</option><option value="on">On</option><option value="off">Off</option>
                        </select>
                    </FormField>
                    <FormField label="Restart">
                        <select value={cmds.restart !== false ? 'true' : 'false'} onChange={e => updateConfig('commands.restart', e.target.value === 'true')}>
                            <option value="true">Yes</option><option value="false">No</option>
                        </select>
                    </FormField>
                </div>
            </GlassCard>
        </div>
    );
}
