import { useConfig } from '../../context/ConfigContext';
import GlassCard from '../ui/GlassCard';
import FormField from '../ui/FormField';
import TagInput from '../ui/TagInput';
import { Plus, Trash2, Box, ChevronDown, ChevronUp, GripVertical, Cpu, Zap } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

function ModelRow({ model, index, onUpdate, onRemove }) {
    const [expanded, setExpanded] = useState(false);

    const update = (field, value) => {
        onUpdate(index, { ...model, [field]: value });
    };

    const updateCost = (field, value) => {
        const cost = { ...(model.cost || { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 }) };
        cost[field] = parseFloat(value) || 0;
        update('cost', cost);
    };

    return (
        <div style={{
            background: 'var(--surface-1)',
            border: 'var(--glass-border)',
            borderRadius: 'var(--radius-md)',
            marginBottom: '8px',
            overflow: 'hidden',
        }}>
            {/* Model row header */}
            <div style={{
                display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px',
                cursor: 'pointer',
            }}
                onClick={() => setExpanded(!expanded)}
            >
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
                    <input
                        value={model.id || ''}
                        onChange={e => { e.stopPropagation(); update('id', e.target.value); }}
                        onClick={e => e.stopPropagation()}
                        placeholder="model-id"
                        style={{ flex: 1, fontFamily: 'var(--font-mono)', fontSize: '0.78rem', padding: '5px 8px', minWidth: '80px' }}
                    />
                    <input
                        value={model.name || ''}
                        onChange={e => { e.stopPropagation(); update('name', e.target.value); }}
                        onClick={e => e.stopPropagation()}
                        placeholder="Display Name"
                        style={{ flex: 1, fontSize: '0.78rem', padding: '5px 8px', minWidth: '80px' }}
                    />
                </div>
                {/* Quick badges */}
                <div style={{ display: 'flex', gap: '4px', alignItems: 'center', flexShrink: 0 }}>
                    {model.reasoning && (
                        <span style={{ fontSize: '0.6rem', padding: '2px 6px', background: 'rgba(236,72,153,0.2)', border: '1px solid rgba(236,72,153,0.3)', borderRadius: '8px', color: '#f472b6' }}>
                            <Zap size={8} style={{ display: 'inline', verticalAlign: 'middle' }} /> Reasoning
                        </span>
                    )}
                    {model.contextWindow && (
                        <span style={{ fontSize: '0.6rem', padding: '2px 6px', background: 'var(--surface-2)', borderRadius: '8px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                            {(model.contextWindow / 1000).toFixed(0)}k ctx
                        </span>
                    )}
                    {model.maxTokens && (
                        <span style={{ fontSize: '0.6rem', padding: '2px 6px', background: 'var(--surface-2)', borderRadius: '8px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                            {(model.maxTokens / 1000).toFixed(0)}k max
                        </span>
                    )}
                </div>
                <button
                    onClick={(e) => { e.stopPropagation(); setExpanded(!expanded); }}
                    style={{ padding: '4px', background: 'none', color: 'var(--text-muted)' }}
                >
                    {expanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                </button>
                <button
                    onClick={(e) => { e.stopPropagation(); onRemove(index); }}
                    style={{ padding: '4px', background: 'none', color: 'var(--danger)', opacity: 0.6 }}
                >
                    <Trash2 size={12} />
                </button>
            </div>

            {/* Expanded details */}
            <AnimatePresence>
                {expanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.15 }}
                        style={{ overflow: 'hidden' }}
                    >
                        <div style={{ padding: '8px 12px 12px', borderTop: 'var(--glass-border)' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '10px', marginBottom: '10px' }}>
                                <FormField label="Reasoning">
                                    <select
                                        value={model.reasoning ? 'true' : 'false'}
                                        onChange={e => update('reasoning', e.target.value === 'true')}
                                        style={{ fontSize: '0.78rem', padding: '5px 8px' }}
                                    >
                                        <option value="false">No</option>
                                        <option value="true">Yes</option>
                                    </select>
                                </FormField>
                                <FormField label="Input Types">
                                    <select
                                        value={(model.input || ['text']).join(',')}
                                        onChange={e => update('input', e.target.value.split(','))}
                                        style={{ fontSize: '0.78rem', padding: '5px 8px' }}
                                    >
                                        <option value="text">Text</option>
                                        <option value="text,image">Text + Image</option>
                                        <option value="text,image,audio">Text + Image + Audio</option>
                                        <option value="text,audio">Text + Audio</option>
                                    </select>
                                </FormField>
                                <FormField label="Context Window">
                                    <input
                                        type="number"
                                        value={model.contextWindow || ''}
                                        onChange={e => update('contextWindow', parseInt(e.target.value) || undefined)}
                                        placeholder="200000"
                                        style={{ fontSize: '0.78rem', padding: '5px 8px' }}
                                    />
                                </FormField>
                                <FormField label="Max Tokens">
                                    <input
                                        type="number"
                                        value={model.maxTokens || ''}
                                        onChange={e => update('maxTokens', parseInt(e.target.value) || undefined)}
                                        placeholder="8192"
                                        style={{ fontSize: '0.78rem', padding: '5px 8px' }}
                                    />
                                </FormField>
                            </div>
                            {/* Cost section */}
                            <label style={{ marginBottom: '6px' }}>Cost (per token)</label>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '8px' }}>
                                {['input', 'output', 'cacheRead', 'cacheWrite'].map(field => (
                                    <div key={field}>
                                        <span style={{ fontSize: '0.6rem', color: 'var(--text-muted)', textTransform: 'capitalize' }}>
                                            {field.replace(/([A-Z])/g, ' $1')}
                                        </span>
                                        <input
                                            type="number"
                                            step="0.001"
                                            value={model.cost?.[field] ?? 0}
                                            onChange={e => updateCost(field, e.target.value)}
                                            style={{ fontSize: '0.75rem', padding: '4px 6px' }}
                                        />
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

function ProviderCard({ name, provider, onUpdate, onRemove, onRename }) {
    const [expanded, setExpanded] = useState(true);
    const [editingName, setEditingName] = useState(false);
    const [newName, setNewName] = useState(name);
    const [showHeaders, setShowHeaders] = useState(false);

    const updateField = (field, value) => {
        onUpdate({ ...provider, [field]: value });
    };

    const addModel = () => {
        const models = provider.models ? [...provider.models] : [];
        models.push({ id: '', name: '', reasoning: false, input: ['text'], contextWindow: 200000, maxTokens: 8192, cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 } });
        updateField('models', models);
    };

    const updateModel = (index, model) => {
        const models = [...(provider.models || [])];
        models[index] = model;
        updateField('models', models);
    };

    const removeModel = (index) => {
        const models = (provider.models || []).filter((_, i) => i !== index);
        updateField('models', models);
    };

    const addHeader = () => {
        const headers = { ...(provider.headers || {}), '': '' };
        updateField('headers', headers);
    };

    const updateHeader = (oldKey, newKey, value) => {
        const headers = { ...(provider.headers || {}) };
        if (oldKey !== newKey) delete headers[oldKey];
        headers[newKey] = value;
        updateField('headers', headers);
    };

    const removeHeader = (key) => {
        const headers = { ...(provider.headers || {}) };
        delete headers[key];
        updateField('headers', headers);
    };

    const handleNameSubmit = () => {
        if (newName.trim() && newName !== name) {
            onRename(name, newName.trim());
        }
        setEditingName(false);
    };

    const headerCount = Object.keys(provider.headers || {}).length;

    return (
        <GlassCard style={{ marginBottom: '12px', padding: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: expanded ? '16px' : 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1 }}>
                    <GripVertical size={14} style={{ color: 'var(--text-muted)' }} />
                    {editingName ? (
                        <input
                            value={newName}
                            onChange={e => setNewName(e.target.value)}
                            onBlur={handleNameSubmit}
                            onKeyDown={e => e.key === 'Enter' && handleNameSubmit()}
                            autoFocus
                            style={{ fontSize: '0.95rem', fontWeight: 600, padding: '4px 8px', width: '200px' }}
                        />
                    ) : (
                        <h4
                            style={{ fontSize: '0.95rem', cursor: 'pointer', color: 'var(--accent-primary-hover)' }}
                            onClick={() => setEditingName(true)}
                            title="Click to rename"
                        >
                            {name}
                        </h4>
                    )}
                    <span style={{
                        fontSize: '0.65rem', padding: '2px 8px',
                        background: 'rgba(99,102,241,0.15)', borderRadius: '10px',
                        color: 'var(--text-secondary)',
                    }}>
                        {provider.api || 'openai'}
                    </span>
                    <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>
                        {(provider.models || []).length} model{(provider.models || []).length !== 1 ? 's' : ''}
                    </span>
                </div>
                <div style={{ display: 'flex', gap: '4px' }}>
                    <button
                        onClick={() => setExpanded(!expanded)}
                        style={{ padding: '6px', background: 'var(--surface-2)', borderRadius: 'var(--radius-sm)', color: 'var(--text-secondary)' }}
                    >
                        {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    </button>
                    <button
                        onClick={onRemove}
                        style={{ padding: '6px', background: 'rgba(239,68,68,0.1)', borderRadius: 'var(--radius-sm)', color: 'var(--danger)' }}
                    >
                        <Trash2 size={14} />
                    </button>
                </div>
            </div>

            <AnimatePresence>
                {expanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        style={{ overflow: 'hidden' }}
                    >
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                            <FormField label="API Type">
                                <select value={provider.api || 'openai'} onChange={e => updateField('api', e.target.value)}>
                                    <option value="openai">OpenAI</option>
                                    <option value="openai-chat">OpenAI Chat</option>
                                    <option value="openai-completions">OpenAI Completions</option>
                                    <option value="anthropic">Anthropic</option>
                                    <option value="ollama">Ollama</option>
                                    <option value="google-ai">Google AI</option>
                                </select>
                            </FormField>
                            <FormField label="Base URL">
                                <input
                                    value={provider.baseUrl || ''}
                                    onChange={e => updateField('baseUrl', e.target.value)}
                                    placeholder="https://api.example.com/v1"
                                />
                            </FormField>
                        </div>

                        <FormField label="API Key">
                            <input
                                type="password"
                                value={provider.apiKey || ''}
                                onChange={e => updateField('apiKey', e.target.value)}
                                placeholder="sk-... or ${ENV_VAR}"
                            />
                        </FormField>

                        {/* Headers toggle */}
                        <div style={{ marginTop: '12px' }}>
                            <button
                                onClick={() => setShowHeaders(!showHeaders)}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: '4px',
                                    fontSize: '0.7rem', padding: '4px 10px', marginBottom: '8px',
                                    background: 'var(--surface-2)', borderRadius: 'var(--radius-sm)',
                                    color: 'var(--text-secondary)',
                                }}
                            >
                                {showHeaders ? <ChevronUp size={10} /> : <ChevronDown size={10} />}
                                Headers {headerCount > 0 && `(${headerCount})`}
                            </button>
                            {showHeaders && (
                                <>
                                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '6px' }}>
                                        <button
                                            onClick={addHeader}
                                            style={{
                                                display: 'flex', alignItems: 'center', gap: '4px',
                                                fontSize: '0.7rem', padding: '4px 10px',
                                                background: 'var(--surface-2)', borderRadius: 'var(--radius-sm)',
                                                color: 'var(--text-secondary)',
                                            }}
                                        >
                                            <Plus size={10} /> Add Header
                                        </button>
                                    </div>
                                    {Object.entries(provider.headers || {}).map(([key, value], i) => (
                                        <div key={i} style={{ display: 'flex', gap: '6px', marginBottom: '4px', alignItems: 'center' }}>
                                            <input
                                                value={key}
                                                onChange={e => updateHeader(key, e.target.value, value)}
                                                placeholder="Header-Name"
                                                style={{ flex: 1, fontSize: '0.78rem', padding: '5px 8px' }}
                                            />
                                            <input
                                                value={value}
                                                onChange={e => updateHeader(key, key, e.target.value)}
                                                placeholder="Value"
                                                style={{ flex: 2, fontSize: '0.78rem', padding: '5px 8px' }}
                                            />
                                            <button
                                                onClick={() => removeHeader(key)}
                                                style={{ padding: '5px', background: 'rgba(239,68,68,0.1)', borderRadius: 'var(--radius-sm)', color: 'var(--danger)', flexShrink: 0 }}
                                            >
                                                <Trash2 size={11} />
                                            </button>
                                        </div>
                                    ))}
                                </>
                            )}
                        </div>

                        {/* Models */}
                        <div style={{ marginTop: '16px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                                <label style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <Cpu size={12} /> Models
                                </label>
                                <button
                                    onClick={addModel}
                                    style={{
                                        display: 'flex', alignItems: 'center', gap: '4px',
                                        fontSize: '0.7rem', padding: '4px 10px',
                                        background: 'var(--accent-primary)', borderRadius: 'var(--radius-sm)',
                                        color: '#fff',
                                    }}
                                >
                                    <Plus size={12} /> Add Model
                                </button>
                            </div>
                            {(provider.models || []).map((model, i) => (
                                <ModelRow
                                    key={i}
                                    model={model}
                                    index={i}
                                    onUpdate={(idx, m) => updateModel(idx, m)}
                                    onRemove={removeModel}
                                />
                            ))}
                            {(!provider.models || provider.models.length === 0) && (
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', textAlign: 'center', padding: '12px' }}>
                                    No models. Click "Add Model" to start.
                                </p>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </GlassCard>
    );
}

export default function ModelsSection() {
    const { config, updateConfig } = useConfig();
    const providers = config.models?.providers || {};

    const addProvider = () => {
        const base = 'new-provider';
        let name = base;
        let i = 1;
        while (providers[name]) { name = `${base}-${i++}`; }
        updateConfig(prev => {
            if (!prev.models) prev.models = {};
            if (!prev.models.providers) prev.models.providers = {};
            prev.models.providers[name] = {
                api: 'openai',
                baseUrl: '',
                apiKey: '',
                headers: {},
                models: []
            };
            return prev;
        });
    };

    const updateProvider = (name, data) => {
        updateConfig(prev => {
            prev.models.providers[name] = data;
            return prev;
        });
    };

    const removeProvider = (name) => {
        updateConfig(prev => {
            delete prev.models.providers[name];
            return prev;
        });
    };

    const renameProvider = (oldName, newName) => {
        updateConfig(prev => {
            if (prev.models.providers[newName]) return prev;
            prev.models.providers[newName] = prev.models.providers[oldName];
            delete prev.models.providers[oldName];
            return prev;
        });
    };

    return (
        <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
                <div>
                    <h2 style={{ fontSize: '1.4rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Box size={22} style={{ color: 'var(--accent-secondary)' }} />
                        Model Providers
                    </h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '4px' }}>
                        Configure AI providers — expand each model row to set reasoning, input types, context window, and cost
                    </p>
                </div>
                <button
                    onClick={addProvider}
                    style={{
                        display: 'flex', alignItems: 'center', gap: '6px',
                        padding: '8px 16px',
                        background: 'var(--accent-gradient)',
                        borderRadius: 'var(--radius-md)',
                        color: '#fff', fontSize: '0.85rem', fontWeight: 500,
                    }}
                >
                    <Plus size={16} /> Add Provider
                </button>
            </div>

            {Object.entries(providers).map(([name, provider]) => (
                <ProviderCard
                    key={name}
                    name={name}
                    provider={provider}
                    onUpdate={data => updateProvider(name, data)}
                    onRemove={() => removeProvider(name)}
                    onRename={renameProvider}
                />
            ))}

            {Object.keys(providers).length === 0 && (
                <GlassCard style={{ textAlign: 'center', padding: '48px' }}>
                    <Box size={40} style={{ color: 'var(--text-muted)', margin: '0 auto 16px' }} />
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '16px' }}>No providers configured yet</p>
                    <button
                        onClick={addProvider}
                        style={{
                            padding: '8px 20px',
                            background: 'var(--accent-gradient)',
                            borderRadius: 'var(--radius-md)',
                            color: '#fff', fontSize: '0.85rem',
                        }}
                    >
                        Add Your First Provider
                    </button>
                </GlassCard>
            )}
        </div>
    );
}
