import { useState, useEffect, useRef } from 'react';
import { useConfig } from '../context/ConfigContext';
import Editor from 'react-simple-code-editor';
import Prism from 'prismjs';
import 'prismjs/components/prism-json';
import 'prismjs/themes/prism-tomorrow.css';
import { Copy, Download, Upload, RotateCcw, Check, AlertCircle } from 'lucide-react';

export default function JsonPanel() {
    const { config, replaceConfig, resetConfig } = useConfig();
    const [code, setCode] = useState('');
    const [copied, setCopied] = useState(false);
    const [jsonError, setJsonError] = useState(null);
    const fileInput = useRef(null);
    const isInternalUpdate = useRef(false);

    // Sync config → editor
    useEffect(() => {
        if (isInternalUpdate.current) {
            isInternalUpdate.current = false;
            return;
        }
        setCode(JSON.stringify(config, null, 2));
        setJsonError(null);
    }, [config]);

    // Manual edits in editor → config
    const handleCodeChange = (newCode) => {
        setCode(newCode);
        try {
            const parsed = JSON.parse(newCode);
            isInternalUpdate.current = true;
            replaceConfig(parsed);
            setJsonError(null);
        } catch (e) {
            setJsonError(e.message);
        }
    };

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(code);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch { /* fallback */ }
    };

    const downloadJson = () => {
        const blob = new Blob([code], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'openclaw.json';
        a.click();
        URL.revokeObjectURL(url);
    };

    const importJson = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (ev) => {
            try {
                const parsed = JSON.parse(ev.target.result);
                replaceConfig(parsed);
            } catch (err) {
                setJsonError(`Import error: ${err.message}`);
            }
        };
        reader.readAsText(file);
        e.target.value = '';
    };

    const highlight = (code) => {
        try {
            return Prism.highlight(code, Prism.languages.json, 'json');
        } catch {
            return code;
        }
    };

    const btnStyle = {
        display: 'flex',
        alignItems: 'center',
        gap: '5px',
        padding: '6px 12px',
        fontSize: '0.7rem',
        fontWeight: 500,
        borderRadius: 'var(--radius-sm)',
        color: 'var(--text-secondary)',
        background: 'var(--surface-2)',
        textTransform: 'uppercase',
        letterSpacing: '0.03em',
    };

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            background: 'rgba(0,0,0,0.3)',
            borderLeft: 'var(--glass-border)',
        }}>
            {/* Header */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 16px',
                borderBottom: 'var(--glass-border)',
                flexShrink: 0,
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        fontFamily: 'var(--font-mono)',
                        color: 'var(--text-secondary)',
                    }}>
                        openclaw.json
                    </span>
                    {jsonError && (
                        <span style={{
                            display: 'flex', alignItems: 'center', gap: '4px',
                            fontSize: '0.65rem', color: 'var(--danger)',
                            padding: '2px 8px', background: 'rgba(239,68,68,0.1)',
                            borderRadius: '10px',
                        }}>
                            <AlertCircle size={10} /> Invalid JSON
                        </span>
                    )}
                </div>
                <div style={{ display: 'flex', gap: '6px' }}>
                    <button onClick={copyToClipboard} style={btnStyle}>
                        {copied ? <Check size={12} /> : <Copy size={12} />}
                        {copied ? 'Copied!' : 'Copy'}
                    </button>
                    <button onClick={downloadJson} style={btnStyle}>
                        <Download size={12} /> Save
                    </button>
                    <button onClick={() => fileInput.current?.click()} style={btnStyle}>
                        <Upload size={12} /> Import
                    </button>
                    <button onClick={resetConfig} style={{ ...btnStyle, color: 'var(--warning)' }}>
                        <RotateCcw size={12} /> Reset
                    </button>
                    <input
                        ref={fileInput}
                        type="file"
                        accept=".json"
                        onChange={importJson}
                        style={{ display: 'none' }}
                    />
                </div>
            </div>

            {/* Editor */}
            <div style={{
                flex: 1,
                overflow: 'auto',
                fontSize: '0.8rem',
                lineHeight: 1.6,
            }}>
                <Editor
                    value={code}
                    onValueChange={handleCodeChange}
                    highlight={highlight}
                    padding={16}
                    style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.8rem',
                        minHeight: '100%',
                        background: 'transparent',
                        color: '#d4d4d8',
                    }}
                    textareaClassName="json-editor-textarea"
                />
            </div>
        </div>
    );
}
