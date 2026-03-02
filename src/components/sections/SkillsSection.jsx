import { useConfig } from '../../context/ConfigContext';
import GlassCard from '../ui/GlassCard';
import TagInput from '../ui/TagInput';
import { ShieldOff } from 'lucide-react';

export default function SkillsSection() {
    const { config, updateConfig } = useConfig();
    const skills = config.skills || {};

    return (
        <div>
            <div style={{ marginBottom: '24px' }}>
                <h2 style={{ fontSize: '1.4rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <ShieldOff size={22} style={{ color: 'var(--warning)' }} />
                    Skills
                </h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '4px' }}>
                    Manage which skills are denied for the agent
                </p>
            </div>

            <GlassCard>
                <h3 style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '12px' }}>
                    Deny List
                </h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '12px' }}>
                    Skills listed here will be blocked from agent use. Common examples: google-search, gmail, google-calendar
                </p>
                <TagInput
                    tags={skills.deny || []}
                    onChange={val => updateConfig('skills.deny', val)}
                    placeholder="Add skill to deny..."
                />
                <div style={{ marginTop: '12px' }}>
                    <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '6px' }}>Quick add common skills:</p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                        {['google-search', 'gmail', 'google-calendar', 'google-drive', 'web-browser', 'code-execution'].map(skill => (
                            !(skills.deny || []).includes(skill) && (
                                <button
                                    key={skill}
                                    onClick={() => updateConfig('skills.deny', [...(skills.deny || []), skill])}
                                    style={{
                                        fontSize: '0.7rem', padding: '3px 10px',
                                        background: 'rgba(245,158,11,0.1)', borderRadius: '12px',
                                        color: 'var(--warning)', fontFamily: 'var(--font-mono)',
                                        border: '1px solid rgba(245,158,11,0.2)',
                                    }}
                                >
                                    + {skill}
                                </button>
                            )
                        ))}
                    </div>
                </div>
            </GlassCard>
        </div>
    );
}
