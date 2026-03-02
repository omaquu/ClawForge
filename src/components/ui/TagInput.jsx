import { useState } from 'react';
import { X, Plus } from 'lucide-react';

export default function TagInput({ tags = [], onChange, placeholder = 'Add item...' }) {
    const [input, setInput] = useState('');

    const addTag = () => {
        const val = input.trim();
        if (val && !tags.includes(val)) {
            onChange([...tags, val]);
            setInput('');
        }
    };

    const removeTag = (index) => {
        onChange(tags.filter((_, i) => i !== index));
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addTag();
        }
        if (e.key === 'Backspace' && !input && tags.length > 0) {
            removeTag(tags.length - 1);
        }
    };

    return (
        <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '6px',
            padding: '8px',
            background: 'var(--surface-input)',
            border: 'var(--glass-border)',
            borderRadius: 'var(--radius-sm)',
            minHeight: '42px',
            alignItems: 'center',
        }}>
            {tags.map((tag, i) => (
                <span
                    key={i}
                    style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        padding: '3px 8px 3px 10px',
                        background: 'rgba(99, 102, 241, 0.2)',
                        border: '1px solid rgba(99, 102, 241, 0.3)',
                        borderRadius: '20px',
                        fontSize: '0.8rem',
                        color: 'var(--accent-primary-hover)',
                        fontFamily: 'var(--font-mono)',
                    }}
                >
                    {tag}
                    <button
                        onClick={() => removeTag(i)}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            background: 'none',
                            padding: '2px',
                            color: 'inherit',
                            opacity: 0.6,
                            borderRadius: '50%',
                        }}
                        onMouseEnter={e => e.currentTarget.style.opacity = 1}
                        onMouseLeave={e => e.currentTarget.style.opacity = 0.6}
                    >
                        <X size={12} />
                    </button>
                </span>
            ))}
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flex: 1, minWidth: '100px' }}>
                <input
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={tags.length === 0 ? placeholder : ''}
                    style={{
                        background: 'none',
                        border: 'none',
                        padding: '2px 4px',
                        flex: 1,
                        minWidth: '60px',
                        fontSize: '0.8rem',
                        boxShadow: 'none',
                    }}
                />
                {input.trim() && (
                    <button
                        onClick={addTag}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            padding: '3px',
                            background: 'var(--accent-primary)',
                            color: '#fff',
                            borderRadius: '50%',
                        }}
                    >
                        <Plus size={12} />
                    </button>
                )}
            </div>
        </div>
    );
}
