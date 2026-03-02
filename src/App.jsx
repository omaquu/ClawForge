import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Server, Box, Bot, ShieldOff, MessageCircle, Variable, KeyRound, Globe, Palette, Plug } from 'lucide-react';
import { ConfigProvider } from './context/ConfigContext';
import GatewaySection from './components/sections/GatewaySection';
import ModelsSection from './components/sections/ModelsSection';
import AgentsSection from './components/sections/AgentsSection';
import SkillsSection from './components/sections/SkillsSection';
import ChannelsSection from './components/sections/ChannelsSection';
import EnvSection from './components/sections/EnvSection';
import AuthSection from './components/sections/AuthSection';
import BrowserSection from './components/sections/BrowserSection';
import InterfaceSection from './components/sections/InterfaceSection';
import PluginsSection from './components/sections/PluginsSection';
import JsonPanel from './components/JsonPanel';
import './App.css';

const sections = [
  { id: 'env', label: 'Environment', Icon: Variable, color: '#f59e0b' },
  { id: 'gateway', label: 'Gateway', Icon: Server, color: '#6366f1' },
  { id: 'models', label: 'Models', Icon: Box, color: '#ec4899' },
  { id: 'agents', label: 'Agents', Icon: Bot, color: '#22c55e' },
  { id: 'auth', label: 'Auth', Icon: KeyRound, color: '#a78bfa' },
  { id: 'channels', label: 'Channels', Icon: MessageCircle, color: '#818cf8' },
  { id: 'browser', label: 'Browser', Icon: Globe, color: '#06b6d4' },
  { id: 'interface', label: 'Interface', Icon: Palette, color: '#f472b6' },
  { id: 'skills', label: 'Skills', Icon: ShieldOff, color: '#f97316' },
  { id: 'plugins', label: 'Plugins', Icon: Plug, color: '#34d399' },
];

const sectionComponents = {
  env: EnvSection,
  gateway: GatewaySection,
  models: ModelsSection,
  agents: AgentsSection,
  auth: AuthSection,
  channels: ChannelsSection,
  browser: BrowserSection,
  interface: InterfaceSection,
  skills: SkillsSection,
  plugins: PluginsSection,
};

export default function App() {
  const [active, setActive] = useState('gateway');
  const ActiveSection = sectionComponents[active];

  return (
    <ConfigProvider>
      <div className="app-shell">
        {/* Sidebar */}
        <nav className="sidebar">
          <div className="sidebar-logo" title="ClawForge">
            <span style={{ fontSize: '1.15rem', fontWeight: 800, background: 'var(--accent-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>CF</span>
          </div>
          <div className="sidebar-links">
            {sections.map(({ id, label, Icon, color }) => (
              <button
                key={id}
                className={`sidebar-btn ${active === id ? 'active' : ''}`}
                onClick={() => setActive(id)}
                title={label}
              >
                <Icon size={18} style={{ color: active === id ? color : undefined }} />
                <span className="sidebar-tooltip">{label}</span>
              </button>
            ))}
          </div>
        </nav>

        {/* Editor Panel */}
        <main className="editor-panel">
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.15 }}
            >
              <ActiveSection />
            </motion.div>
          </AnimatePresence>
        </main>

        {/* JSON Panel */}
        <JsonPanel />
      </div>
    </ConfigProvider>
  );
}
