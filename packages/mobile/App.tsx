import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useOffice } from './src/useOffice';
import { AgentsScreen } from './src/AgentsScreen';
import { ChatScreen } from './src/ChatScreen';
import { TasksScreen } from './src/TasksScreen';
import { colors } from './src/theme';

const STORAGE_KEY = 'agent-office:endpoint';
// Android emulator reaches the host machine at 10.0.2.2; on a real device use your computer's LAN IP.
const DEFAULT_ENDPOINT = 'ws://10.0.2.2:3000';
const TABS = ['Agents', 'Chat', 'Tasks'] as const;
type Tab = (typeof TABS)[number];

function Office({ endpoint, onChangeServer }: { endpoint: string; onChangeServer: () => void }) {
    const [tab, setTab] = useState<Tab>('Agents');
    const { status, error, agents, chat, tasks, sendChat, assignTask } = useOffice(endpoint);

    return (
        <SafeAreaView style={styles.root}>
            <View style={styles.header}>
                <Text style={styles.logo}>🏢 AgentOffice</Text>
                <TouchableOpacity onPress={onChangeServer}>
                    <Text style={[styles.status, { color: status === 'connected' ? colors.good : status === 'error' ? colors.bad : colors.muted }]}>
                        ● {status} ⚙
                    </Text>
                </TouchableOpacity>
            </View>
            {status === 'error' && <Text style={styles.error}>Can't reach {endpoint}. {error}</Text>}
            <View style={{ flex: 1 }}>
                {tab === 'Agents' && <AgentsScreen agents={agents} />}
                {tab === 'Chat' && <ChatScreen chat={chat} onSend={sendChat} />}
                {tab === 'Tasks' && <TasksScreen tasks={tasks} agents={agents} onAssign={assignTask} />}
            </View>
            <View style={styles.tabs}>
                {TABS.map((t) => (
                    <TouchableOpacity key={t} style={styles.tab} onPress={() => setTab(t)}>
                        <Text style={[styles.tabText, tab === t && { color: colors.accent }]}>{t}</Text>
                    </TouchableOpacity>
                ))}
            </View>
        </SafeAreaView>
    );
}

function Connect({ initial, onConnect }: { initial: string; onConnect: (url: string) => void }) {
    const [url, setUrl] = useState(initial);
    return (
        <SafeAreaView style={[styles.root, { justifyContent: 'center', padding: 24 }]}>
            <Text style={styles.logo}>🏢 AgentOffice</Text>
            <Text style={styles.hint}>Server address (e.g. ws://192.168.1.20:3000)</Text>
            <TextInput
                style={styles.input}
                value={url}
                onChangeText={setUrl}
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="url"
            />
            <TouchableOpacity style={styles.button} onPress={() => onConnect(url.trim())}>
                <Text style={styles.buttonText}>Connect</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
}

export default function App() {
    const [endpoint, setEndpoint] = useState<string | null>(null);
    const [saved, setSaved] = useState(DEFAULT_ENDPOINT);
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        AsyncStorage.getItem(STORAGE_KEY)
            .then((v) => v && setSaved(v))
            .catch(() => {})
            .finally(() => setLoaded(true));
    }, []);

    const connect = (url: string) => {
        if (!url) return;
        AsyncStorage.setItem(STORAGE_KEY, url).catch(() => {});
        setSaved(url);
        setEndpoint(url);
    };

    return (
        <>
            <StatusBar style="light" />
            {!loaded ? null : endpoint ? (
                <Office endpoint={endpoint} onChangeServer={() => setEndpoint(null)} />
            ) : (
                <Connect initial={saved} onConnect={connect} />
            )}
        </>
    );
}

const styles = StyleSheet.create({
    root: { flex: 1, backgroundColor: colors.bg },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 14, borderBottomWidth: 1, borderColor: colors.border },
    logo: { color: colors.text, fontSize: 20, fontWeight: '800' },
    status: { fontSize: 13 },
    error: { color: colors.bad, padding: 12 },
    tabs: { flexDirection: 'row', borderTopWidth: 1, borderColor: colors.border },
    tab: { flex: 1, alignItems: 'center', paddingVertical: 14 },
    tabText: { color: colors.muted, fontWeight: '700' },
    hint: { color: colors.muted, marginTop: 24, marginBottom: 8 },
    input: { backgroundColor: colors.card, color: colors.text, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 12 },
    button: { backgroundColor: colors.accent, borderRadius: 10, paddingVertical: 12, alignItems: 'center', marginTop: 16 },
    buttonText: { color: '#fff', fontWeight: '700' },
});
