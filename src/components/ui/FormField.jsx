export default function FormField({ label, children, hint, inline = false }) {
    return (
        <div style={{
            marginBottom: '16px',
            display: inline ? 'flex' : 'block',
            alignItems: inline ? 'center' : undefined,
            gap: inline ? '12px' : undefined,
        }}>
            {label && (
                <label style={{
                    minWidth: inline ? '100px' : undefined,
                    marginBottom: inline ? 0 : '5px',
                    flexShrink: inline ? 0 : undefined,
                }}>
                    {label}
                </label>
            )}
            <div style={{ flex: 1 }}>{children}</div>
            {hint && (
                <p style={{
                    fontSize: '0.7rem',
                    color: 'var(--text-muted)',
                    marginTop: '4px',
                }}>
                    {hint}
                </p>
            )}
        </div>
    );
}
