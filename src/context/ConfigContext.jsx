import { createContext, useContext, useState, useCallback } from 'react';

const ConfigContext = createContext();

const DEFAULT_CONFIG = {
    meta: {},
    env: {},
    gateway: {
        mode: 'local',
        bind: 'loopback',
        port: 18789,
        auth: { mode: 'none', token: '' },
        controlUi: { enabled: true, basePath: '/' },
        tailscale: { mode: 'off', resetOnExit: false },
    },
    skills: { deny: [] },
    agents: {
        defaults: {
            model: { primary: '', fallbacks: [] },
            tools: [],
            maxConcurrent: 4,
            typingIntervalSeconds: 3,
            typingMode: 'thinking',
            workspace: '',
            subagents: { maxConcurrent: 8 },
        },
        list: [],
    },
    models: { providers: {} },
    channels: {},
    auth: { profiles: {} },
    browser: {
        evaluateEnabled: true,
        cdpUrl: '',
        remoteCdpTimeoutMs: 1500,
        remoteCdpHandshakeTimeoutMs: 3000,
        defaultProfile: 'openclaw',
        snapshotDefaults: { mode: 'efficient' },
    },
    ui: { seamColor: '#FF8C00', assistant: { name: '' } },
    messages: {
        inbound: { debounceMs: 8000 },
        ackReactionScope: 'group-mentions',
        tts: { auto: 'off', provider: 'edge', edge: { enabled: true, voice: '', lang: '' } },
    },
    commands: { native: 'auto', nativeSkills: 'auto', restart: true },
    tools: { message: { crossContext: { allowAcrossProviders: true } } },
    plugins: { entries: {} },
};

/* Deep clone */
function cloneDeep(obj) {
    return JSON.parse(JSON.stringify(obj));
}

/* Set value at dot-path */
function setAtPath(obj, path, value) {
    const keys = path.split('.');
    let current = obj;
    for (let i = 0; i < keys.length - 1; i++) {
        if (current[keys[i]] === undefined) current[keys[i]] = {};
        current = current[keys[i]];
    }
    current[keys[keys.length - 1]] = value;
}

export function ConfigProvider({ children }) {
    const [config, setConfig] = useState(() => cloneDeep(DEFAULT_CONFIG));

    const updateConfig = useCallback((pathOrUpdater, value) => {
        setConfig(prev => {
            const next = cloneDeep(prev);
            if (typeof pathOrUpdater === 'function') {
                const result = pathOrUpdater(next);
                return result || next;
            }
            setAtPath(next, pathOrUpdater, value);
            return next;
        });
    }, []);

    const replaceConfig = useCallback((newConfig) => {
        setConfig(cloneDeep(newConfig));
    }, []);

    const resetConfig = useCallback(() => {
        setConfig(cloneDeep(DEFAULT_CONFIG));
    }, []);

    return (
        <ConfigContext.Provider value={{ config, updateConfig, replaceConfig, resetConfig }}>
            {children}
        </ConfigContext.Provider>
    );
}

export function useConfig() {
    const ctx = useContext(ConfigContext);
    if (!ctx) throw new Error('useConfig must be used within ConfigProvider');
    return ctx;
}
