import { motion } from 'framer-motion';

export default function GlassCard({ children, className = '', animate = true, ...props }) {
    const Component = animate ? motion.div : 'div';
    const motionProps = animate ? {
        initial: { opacity: 0, y: 12 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.3, ease: 'easeOut' }
    } : {};

    return (
        <Component
            className={`glass-card ${className}`}
            {...motionProps}
            {...props}
            style={{
                background: 'var(--glass-bg)',
                border: 'var(--glass-border)',
                borderRadius: 'var(--radius-lg)',
                padding: '24px',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                ...props.style
            }}
        >
            {children}
        </Component>
    );
}
