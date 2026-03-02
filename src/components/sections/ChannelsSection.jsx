import { useConfig } from '../../context/ConfigContext';
import GlassCard from '../ui/GlassCard';
import FormField from '../ui/FormField';
import TagInput from '../ui/TagInput';
import { Plus, Trash2, MessageCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

function DiscordAccountCard({ name, account, onUpdate, onRemove }) {
    const [expanded, setExpanded] = useState(false);
    const guilds = account.guilds || {};
    const set = (f, v) => onUpdate({ ...account, [f]: v });
    const addGuild = () => set('guilds', { ...guilds, [`guild-${Date.now().toString(36).slice(-5)}`]: { requireMention: true } });

    return (
        <div style={{ border: 'var(--glass-border)', borderRadius: 'var(--radius-md)', padding: '12px', marginBottom: '8px', background: 'var(--surface-1)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }} onClick={() => setExpanded(!expanded)}>
                <span style={{ fontSize: '1rem' }}>🎮</span>
                <span style={{ flex: 1, fontWeight: 600, fontSize: '0.85rem' }}>{account.name || name}</span>
                <span style={{ fontSize: '0.65rem', padding: '2px 8px', borderRadius: '8px', background: account.enabled !== false ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)', color: account.enabled !== false ? '#22c55e' : '#ef4444' }}>
                    {account.enabled !== false ? 'Active' : 'Disabled'}
                </span>
                {expanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                <button onClick={e => { e.stopPropagation(); onRemove(); }} style={{ padding: '4px', background: 'none', color: 'var(--danger)', opacity: 0.6 }}><Trash2 size={12} /></button>
            </div>
            <AnimatePresence>
                {expanded && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.15 }} style={{ overflow: 'hidden' }}>
                        <div style={{ paddingTop: '12px', borderTop: 'var(--glass-border)', marginTop: '8px' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
                                <FormField label="Name"><input value={account.name || ''} onChange={e => set('name', e.target.value)} placeholder="Bot Name" /></FormField>
                                <FormField label="Enabled">
                                    <select value={account.enabled !== false ? 'true' : 'false'} onChange={e => set('enabled', e.target.value === 'true')}><option value="true">Yes</option><option value="false">No</option></select>
                                </FormField>
                            </div>
                            <FormField label="Token"><input type="password" value={account.token || ''} onChange={e => set('token', e.target.value)} placeholder="${DISCORD_TOKEN}" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }} /></FormField>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '10px' }}>
                                <FormField label="Allow Bots">
                                    <select value={account.allowBots ? 'true' : 'false'} onChange={e => set('allowBots', e.target.value === 'true')}><option value="false">No</option><option value="true">Yes</option></select>
                                </FormField>
                                <FormField label="Group Policy">
                                    <select value={account.groupPolicy || 'allowlist'} onChange={e => set('groupPolicy', e.target.value)}>
                                        <option value="allowlist">Allowlist</option><option value="denylist">Denylist</option><option value="all">All</option>
                                    </select>
                                </FormField>
                            </div>
                            <div style={{ marginTop: '12px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                                    <label style={{ margin: 0, fontSize: '0.7rem' }}>Guilds</label>
                                    <button onClick={addGuild} style={{ fontSize: '0.65rem', padding: '2px 8px', background: 'var(--surface-2)', borderRadius: 'var(--radius-sm)', color: 'var(--text-secondary)' }}><Plus size={10} style={{ display: 'inline', verticalAlign: 'middle' }} /> Add</button>
                                </div>
                                {Object.entries(guilds).map(([gid, g]) => (
                                    <div key={gid} style={{ display: 'flex', gap: '6px', marginBottom: '4px', alignItems: 'center' }}>
                                        <input value={gid} onChange={e => { const ng = { ...guilds }; ng[e.target.value] = ng[gid]; delete ng[gid]; set('guilds', ng); }} placeholder="Guild ID" style={{ flex: 1, fontFamily: 'var(--font-mono)', fontSize: '0.75rem' }} />
                                        <label style={{ fontSize: '0.65rem', display: 'flex', alignItems: 'center', gap: '4px', margin: 0, whiteSpace: 'nowrap' }}>
                                            <input type="checkbox" checked={!g.requireMention} onChange={e => { const ng = { ...guilds }; ng[gid] = { ...g, requireMention: !e.target.checked }; set('guilds', ng); }} />No @mention
                                        </label>
                                        <button onClick={() => { const ng = { ...guilds }; delete ng[gid]; set('guilds', ng); }} style={{ padding: '3px', background: 'none', color: 'var(--danger)' }}><Trash2 size={10} /></button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default function ChannelsSection() {
    const { config, updateConfig } = useConfig();
    const channels = config.channels || {};
    const discord = channels.discord || {};
    const accounts = discord.accounts || {};
    const twitch = channels.twitch || {};
    const telegram = channels.telegram || {};
    const whatsapp = channels.whatsapp || {};

    const addDiscordAccount = () => {
        const id = `bot-${Date.now().toString(36).slice(-4)}`;
        updateConfig(prev => {
            if (!prev.channels) prev.channels = {};
            if (!prev.channels.discord) prev.channels.discord = { enabled: true, groupPolicy: 'allowlist', accounts: {} };
            if (!prev.channels.discord.accounts) prev.channels.discord.accounts = {};
            prev.channels.discord.accounts[id] = { name: '', enabled: true, token: '', groupPolicy: 'allowlist', guilds: {} };
            return prev;
        });
    };

    const updateDiscordAccount = (name, data) => { updateConfig(prev => { prev.channels.discord.accounts[name] = data; return prev; }); };
    const removeDiscordAccount = (name) => { updateConfig(prev => { delete prev.channels.discord.accounts[name]; return prev; }); };

    return (
        <div>
            <div style={{ marginBottom: '24px' }}>
                <h2 style={{ fontSize: '1.4rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <MessageCircle size={22} style={{ color: '#818cf8' }} /> Channels
                </h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '4px' }}>Discord, Telegram, WhatsApp, Twitch integrations</p>
            </div>

            {/* Discord */}
            <GlassCard style={{ marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                    <h3 style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>🎮 Discord</h3>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <select value={discord.enabled !== false ? 'true' : 'false'} onChange={e => updateConfig('channels.discord.enabled', e.target.value === 'true')} style={{ fontSize: '0.7rem', padding: '3px 8px', width: 'auto' }}>
                            <option value="true">Enabled</option><option value="false">Disabled</option>
                        </select>
                        <button onClick={addDiscordAccount} style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.7rem', padding: '4px 10px', background: 'var(--accent-primary)', borderRadius: 'var(--radius-sm)', color: '#fff' }}>
                            <Plus size={12} /> Account
                        </button>
                    </div>
                </div>
                <FormField label="Group Policy">
                    <select value={discord.groupPolicy || 'allowlist'} onChange={e => updateConfig('channels.discord.groupPolicy', e.target.value)} style={{ width: '200px' }}>
                        <option value="allowlist">Allowlist</option><option value="denylist">Denylist</option><option value="all">All</option>
                    </select>
                </FormField>
                {Object.entries(accounts).map(([name, acc]) => (
                    <DiscordAccountCard key={name} name={name} account={acc} onUpdate={d => updateDiscordAccount(name, d)} onRemove={() => removeDiscordAccount(name)} />
                ))}
                {Object.keys(accounts).length === 0 && (
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', textAlign: 'center', padding: '16px' }}>No Discord accounts configured.</p>
                )}
            </GlassCard>

            {/* Telegram */}
            <GlassCard style={{ marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                    <h3 style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>✈️ Telegram</h3>
                    <select value={telegram.enabled ? 'true' : 'false'} onChange={e => updateConfig('channels.telegram.enabled', e.target.value === 'true')} style={{ fontSize: '0.7rem', padding: '3px 8px', width: 'auto' }}>
                        <option value="true">Enabled</option><option value="false">Disabled</option>
                    </select>
                </div>
                <FormField label="Bot Token" hint="Get from @BotFather on Telegram">
                    <input type="password" value={telegram.botToken || ''} onChange={e => updateConfig('channels.telegram.botToken', e.target.value)} placeholder="${TELEGRAM_BOT_TOKEN}" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }} />
                </FormField>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '10px' }}>
                    <FormField label="Group Policy">
                        <select value={telegram.groupPolicy || 'allowlist'} onChange={e => updateConfig('channels.telegram.groupPolicy', e.target.value)}>
                            <option value="allowlist">Allowlist</option><option value="denylist">Denylist</option><option value="all">All</option>
                        </select>
                    </FormField>
                    <FormField label="Allow Group Messages">
                        <select value={telegram.allowGroupMessages !== false ? 'true' : 'false'} onChange={e => updateConfig('channels.telegram.allowGroupMessages', e.target.value === 'true')}>
                            <option value="true">Yes</option><option value="false">No</option>
                        </select>
                    </FormField>
                </div>
                <FormField label="Allowed Chat IDs" hint="Restrict to specific chat/group IDs" style={{ marginTop: '10px' }}>
                    <TagInput
                        tags={telegram.allowedChatIds || []}
                        onChange={val => updateConfig('channels.telegram.allowedChatIds', val)}
                        placeholder="Add chat ID..."
                    />
                </FormField>
            </GlassCard>

            {/* WhatsApp */}
            <GlassCard style={{ marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                    <h3 style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>💬 WhatsApp</h3>
                    <select value={whatsapp.enabled ? 'true' : 'false'} onChange={e => updateConfig('channels.whatsapp.enabled', e.target.value === 'true')} style={{ fontSize: '0.7rem', padding: '3px 8px', width: 'auto' }}>
                        <option value="true">Enabled</option><option value="false">Disabled</option>
                    </select>
                </div>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '12px', padding: '8px 12px', background: 'var(--surface-1)', borderRadius: 'var(--radius-sm)', border: 'var(--glass-border)' }}>
                    WhatsApp uses QR-code pairing via <code style={{ color: 'var(--accent-primary-hover)' }}>openclaw onboard</code>. Credentials are stored in <code style={{ color: 'var(--accent-primary-hover)' }}>~/.openclaw/credentials/whatsapp-creds.json</code>
                </p>
                <FormField label="Credentials Path" hint="Custom path for session credentials">
                    <input value={whatsapp.credentialsPath || ''} onChange={e => updateConfig('channels.whatsapp.credentialsPath', e.target.value)} placeholder="~/.openclaw/credentials/whatsapp-creds.json" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }} />
                </FormField>
                <FormField label="Group Policy" style={{ marginTop: '10px' }}>
                    <select value={whatsapp.groupPolicy || 'allowlist'} onChange={e => updateConfig('channels.whatsapp.groupPolicy', e.target.value)}>
                        <option value="allowlist">Allowlist</option><option value="denylist">Denylist</option><option value="all">All</option>
                    </select>
                </FormField>
                <FormField label="Allowed Contacts" hint="Phone numbers or JIDs allowed to message" style={{ marginTop: '10px' }}>
                    <TagInput
                        tags={whatsapp.allowFrom || []}
                        onChange={val => updateConfig('channels.whatsapp.allowFrom', val)}
                        placeholder="Add phone number..."
                    />
                </FormField>
            </GlassCard>

            {/* Twitch */}
            <GlassCard>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                    <h3 style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>📺 Twitch</h3>
                    <select value={twitch.enabled ? 'true' : 'false'} onChange={e => updateConfig('channels.twitch.enabled', e.target.value === 'true')} style={{ fontSize: '0.7rem', padding: '3px 8px', width: 'auto' }}>
                        <option value="true">Enabled</option><option value="false">Disabled</option>
                    </select>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <FormField label="Username"><input value={twitch.username || ''} onChange={e => updateConfig('channels.twitch.username', e.target.value)} placeholder="BotUsername" /></FormField>
                    <FormField label="Channel"><input value={twitch.channel || ''} onChange={e => updateConfig('channels.twitch.channel', e.target.value)} placeholder="channel_name" /></FormField>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '10px' }}>
                    <FormField label="Access Token"><input type="password" value={twitch.accessToken || ''} onChange={e => updateConfig('channels.twitch.accessToken', e.target.value)} placeholder="${TWITCH_ACCESSTOKEN}" /></FormField>
                    <FormField label="Refresh Token"><input type="password" value={twitch.refreshToken || ''} onChange={e => updateConfig('channels.twitch.refreshToken', e.target.value)} placeholder="${TWITCH_REFRESHTOKEN}" /></FormField>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '10px' }}>
                    <FormField label="Client ID"><input type="password" value={twitch.clientId || ''} onChange={e => updateConfig('channels.twitch.clientId', e.target.value)} placeholder="${TWITCH_CLIENTID}" /></FormField>
                    <FormField label="Client Secret"><input type="password" value={twitch.clientSecret || ''} onChange={e => updateConfig('channels.twitch.clientSecret', e.target.value)} placeholder="${TWITCH_CLIENTSECRET}" /></FormField>
                </div>
            </GlassCard>
        </div>
    );
}
