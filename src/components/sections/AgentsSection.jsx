import { useConfig } from '../../context/ConfigContext';
import GlassCard from '../ui/GlassCard';
import FormField from '../ui/FormField';
import TagInput from '../ui/TagInput';
import { Bot, Plus, Trash2, ChevronDown, ChevronUp, Sparkles, Users } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

function AgentCard({ agent, index, onUpdate, onRemove, allModelOptions }) {
    const [expanded, setExpanded] = useState(false);

    const update = (field, value) => {
        onUpdate(index, { ...agent, [field]: value });
    };

    const updateIdentity = (field, value) => {
        const identity = { ...(agent.identity || {}), [field]: value };
        update('identity', identity);
    };

    const modelValue = typeof agent.model === 'string'
        ? agent.model
        : agent.model?.primary || '';

    const hasFallbacks = typeof agent.model === 'object' && agent.model?.fallbacks?.length > 0;

    return (
        <GlassCard style={{ marginBottom: '10px', padding: '12px 16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }} onClick={() => setExpanded(!expanded)}>
                <span style={{ fontSize: '1.2rem' }}>{agent.identity?.emoji || '🤖'}</span>
                <div style={{ flex: 1 }}>
                    <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{agent.identity?.name || agent.name || agent.id}</span>
                    {agent.identity?.theme && (
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginLeft: '8px' }}>{agent.identity.theme}</span>
                    )}
                </div>
                <span style={{ fontSize: '0.7rem', color: 'var(--accent-primary-hover)', fontFamily: 'var(--font-mono)' }}>{modelValue}</span>
                <button onClick={e => { e.stopPropagation(); setExpanded(!expanded); }} style={{ padding: '4px', background: 'none', color: 'var(--text-muted)' }}>
                    {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </button>
                <button onClick={e => { e.stopPropagation(); onRemove(index); }} style={{ padding: '4px', background: 'none', color: 'var(--danger)', opacity: 0.6 }}>
                    <Trash2 size={14} />
                </button>
            </div>
            <AnimatePresence>
                {expanded && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.15 }} style={{ overflow: 'hidden' }}>
                        <div style={{ paddingTop: '12px', borderTop: 'var(--glass-border)', marginTop: '12px' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '12px' }}>
                                <FormField label="ID">
                                    <input value={agent.id || ''} onChange={e => update('id', e.target.value)} placeholder="agent-id" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }} />
                                </FormField>
                                <FormField label="Name">
                                    <input value={agent.name || ''} onChange={e => update('name', e.target.value)} placeholder="Display name" />
                                </FormField>
                            </div>
                            <FormField label="Model">
                                <input
                                    value={modelValue}
                                    onChange={e => update('model', e.target.value)}
                                    list={`agent-model-${index}`}
                                    placeholder="provider/model-id"
                                    style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}
                                />
                                {allModelOptions.length > 0 && (
                                    <datalist id={`agent-model-${index}`}>
                                        {allModelOptions.map(opt => <option key={opt} value={opt} />)}
                                    </datalist>
                                )}
                            </FormField>
                            {hasFallbacks && (
                                <FormField label="Fallbacks">
                                    <TagInput
                                        tags={agent.model.fallbacks}
                                        onChange={val => update('model', { ...agent.model, fallbacks: val })}
                                        placeholder="Add fallback..."
                                    />
                                </FormField>
                            )}
                            <h4 style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '8px', marginTop: '12px' }}>Identity</h4>
                            <div style={{ display: 'grid', gridTemplateColumns: '60px 1fr 1fr', gap: '10px' }}>
                                <FormField label="Emoji">
                                    <input value={agent.identity?.emoji || ''} onChange={e => updateIdentity('emoji', e.target.value)} placeholder="🤖" style={{ textAlign: 'center' }} />
                                </FormField>
                                <FormField label="Identity Name">
                                    <input value={agent.identity?.name || ''} onChange={e => updateIdentity('name', e.target.value)} placeholder="Agent Name" />
                                </FormField>
                                <FormField label="Theme/Role">
                                    <input value={agent.identity?.theme || ''} onChange={e => updateIdentity('theme', e.target.value)} placeholder="The Builder - specialized in..." />
                                </FormField>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </GlassCard>
    );
}

export default function AgentsSection() {
    const { config, updateConfig } = useConfig();
    const agents = config.agents?.defaults || {};
    const model = agents.model || {};
    const agentList = config.agents?.list || [];
    const providers = config.models?.providers || {};
    const subagents = agents.subagents || {};

    const allModelOptions = [];
    Object.entries(providers).forEach(([provName, prov]) => {
        (prov.models || []).forEach(m => {
            allModelOptions.push(`${provName}/${m.id}`);
        });
    });

    const addAgent = () => {
        updateConfig(prev => {
            if (!prev.agents) prev.agents = {};
            if (!prev.agents.list) prev.agents.list = [];
            prev.agents.list.push({
                id: `agent-${prev.agents.list.length + 1}`,
                name: '',
                model: '',
                identity: { name: '', theme: '', emoji: '🤖' }
            });
            return prev;
        });
    };

    const updateAgent = (index, agent) => {
        updateConfig(prev => {
            prev.agents.list[index] = agent;
            return prev;
        });
    };

    const removeAgent = (index) => {
        updateConfig(prev => {
            prev.agents.list = prev.agents.list.filter((_, i) => i !== index);
            return prev;
        });
    };

    return (
        <div>
            <div style={{ marginBottom: '24px' }}>
                <h2 style={{ fontSize: '1.4rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Bot size={22} style={{ color: '#22c55e' }} />
                    Agents
                </h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '4px' }}>
                    Configure default model, subagents, and named agent personas
                </p>
            </div>

            {/* Defaults */}
            <GlassCard style={{ marginBottom: '16px' }}>
                <h3 style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>Default Model</h3>
                <FormField label="Primary" hint="Format: provider-name/model-id">
                    <input
                        value={model.primary || ''}
                        onChange={e => updateConfig('agents.defaults.model.primary', e.target.value)}
                        list="primary-model-list"
                        placeholder="e.g. omaquu-g4f/glm-4.7"
                        style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}
                    />
                    {allModelOptions.length > 0 && (
                        <datalist id="primary-model-list">
                            {allModelOptions.map(opt => <option key={opt} value={opt} />)}
                        </datalist>
                    )}
                </FormField>
                <FormField label="Fallbacks">
                    <TagInput
                        tags={model.fallbacks || []}
                        onChange={val => updateConfig('agents.defaults.model.fallbacks', val)}
                        placeholder="Add fallback model..."
                    />
                </FormField>
                {allModelOptions.length > 0 && (
                    <div style={{ marginTop: '4px' }}>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                            {allModelOptions
                                .filter(opt => !(model.fallbacks || []).includes(opt) && opt !== model.primary)
                                .slice(0, 6)
                                .map(opt => (
                                    <button key={opt} onClick={() => updateConfig('agents.defaults.model.fallbacks', [...(model.fallbacks || []), opt])} style={{ fontSize: '0.65rem', padding: '2px 8px', background: 'var(--surface-2)', borderRadius: '10px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                                        + {opt}
                                    </button>
                                ))
                            }
                        </div>
                    </div>
                )}
            </GlassCard>

            {/* Subagents */}
            <GlassCard style={{ marginBottom: '16px' }}>
                <h3 style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Sparkles size={14} /> Subagents & Concurrency
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                    <FormField label="Max Concurrent">
                        <input type="number" value={agents.maxConcurrent || 4} onChange={e => updateConfig('agents.defaults.maxConcurrent', parseInt(e.target.value) || 4)} min={1} max={32} />
                    </FormField>
                    <FormField label="Sub Max Concurrent">
                        <input type="number" value={subagents.maxConcurrent || 8} onChange={e => updateConfig(prev => { if (!prev.agents.defaults.subagents) prev.agents.defaults.subagents = {}; prev.agents.defaults.subagents.maxConcurrent = parseInt(e.target.value) || 8; return prev; })} min={1} max={32} />
                    </FormField>
                    <FormField label="Typing Interval (s)">
                        <input type="number" value={agents.typingIntervalSeconds || 3} onChange={e => updateConfig('agents.defaults.typingIntervalSeconds', parseInt(e.target.value) || 3)} min={0} />
                    </FormField>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '12px' }}>
                    <FormField label="Typing Mode">
                        <select value={agents.typingMode || 'thinking'} onChange={e => updateConfig('agents.defaults.typingMode', e.target.value)}>
                            <option value="thinking">Thinking</option>
                            <option value="typing">Typing</option>
                            <option value="off">Off</option>
                        </select>
                    </FormField>
                    <FormField label="Workspace Path">
                        <input value={agents.workspace || ''} onChange={e => updateConfig('agents.defaults.workspace', e.target.value)} placeholder="/data/workspace" />
                    </FormField>
                </div>
            </GlassCard>

            {/* Tools */}
            <GlassCard style={{ marginBottom: '16px' }}>
                <h3 style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '12px' }}>Tools</h3>
                <TagInput tags={agents.tools || []} onChange={val => updateConfig('agents.defaults.tools', val)} placeholder="Add tool name..." />
            </GlassCard>

            {/* Agent List */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px', marginTop: '28px' }}>
                <h3 style={{ fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Users size={18} style={{ color: '#22c55e' }} />
                    Agent Personas
                </h3>
                <button onClick={addAgent} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 14px', background: 'var(--accent-gradient)', borderRadius: 'var(--radius-md)', color: '#fff', fontSize: '0.8rem', fontWeight: 500 }}>
                    <Plus size={14} /> Add Agent
                </button>
            </div>

            {agentList.map((agent, i) => (
                <AgentCard key={i} agent={agent} index={i} onUpdate={updateAgent} onRemove={removeAgent} allModelOptions={allModelOptions} />
            ))}

            {agentList.length === 0 && (
                <GlassCard style={{ textAlign: 'center', padding: '32px' }}>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>No custom agents. Add one to create named personas.</p>
                </GlassCard>
            )}
        </div>
    );
}
