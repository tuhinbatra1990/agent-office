import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { AgentInfo } from './useOffice';
import { colors } from './theme';

const EMOJI: Record<string, string> = {
    idle: '😌',
    talk: '💬',
    talking: '💬',
    work: '💻',
    working: '💻',
    use_tool: '🔧',
    move: '🚶',
    think: '💡',
};

const pct = (n: number) => `${Math.round(Math.max(0, Math.min(1, n)) * 100)}%`;

function Bar({ label, value }: { label: string; value: number }) {
    return (
        <View style={styles.barRow}>
            <Text style={styles.barLabel}>{label}</Text>
            <View style={styles.barTrack}>
                <View style={[styles.barFill, { width: pct(value) as any }]} />
            </View>
        </View>
    );
}

export function AgentsScreen({ agents }: { agents: AgentInfo[] }) {
    return (
        <FlatList
            data={agents}
            keyExtractor={(a) => a.id}
            contentContainerStyle={{ padding: 12 }}
            ListEmptyComponent={<Text style={styles.empty}>No agents in the office yet.</Text>}
            renderItem={({ item: a }) => (
                <View style={styles.card}>
                    <Text style={styles.name}>
                        {EMOJI[a.action] ?? '🧑‍💼'} {a.name}
                    </Text>
                    <Text style={styles.action}>{a.action}</Text>
                    {!!a.currentTask && <Text style={styles.task}>Task: {a.currentTask}</Text>}
                    {!!a.thought && <Text style={styles.thought}>“{a.thought}”</Text>}
                    <Bar label="Mood" value={a.mood} />
                    <Bar label="Reputation" value={a.reputation} />
                </View>
            )}
        />
    );
}

const styles = StyleSheet.create({
    card: { backgroundColor: colors.card, borderColor: colors.border, borderWidth: 1, borderRadius: 12, padding: 14, marginBottom: 10 },
    name: { color: colors.text, fontSize: 18, fontWeight: '700' },
    action: { color: colors.accent, marginTop: 2, marginBottom: 6 },
    task: { color: colors.text, marginBottom: 4 },
    thought: { color: colors.muted, fontStyle: 'italic', marginBottom: 8 },
    barRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
    barLabel: { color: colors.muted, width: 90, fontSize: 12 },
    barTrack: { flex: 1, height: 6, borderRadius: 3, backgroundColor: colors.border },
    barFill: { height: 6, borderRadius: 3, backgroundColor: colors.good },
    empty: { color: colors.muted, textAlign: 'center', marginTop: 40 },
});
