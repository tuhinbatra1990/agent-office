import React, { useState } from 'react';
import { FlatList, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { AgentInfo, Task } from './useOffice';
import { colors } from './theme';

interface Props {
    tasks: Task[];
    agents: AgentInfo[];
    onAssign: (title: string, agentId?: string) => void;
}

export function TasksScreen({ tasks, agents, onAssign }: Props) {
    const [title, setTitle] = useState('');
    const [agentId, setAgentId] = useState<string | undefined>();

    const submit = () => {
        const t = title.trim();
        if (!t) return;
        onAssign(t, agentId);
        setTitle('');
    };

    return (
        <View style={{ flex: 1 }}>
            <View style={styles.form}>
                <TextInput
                    style={styles.input}
                    value={title}
                    onChangeText={setTitle}
                    onSubmitEditing={submit}
                    placeholder="New task…"
                    placeholderTextColor={colors.muted}
                />
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginVertical: 8 }}>
                    {[{ id: undefined as string | undefined, name: 'Auto' }, ...agents].map((a) => (
                        <TouchableOpacity
                            key={a.id ?? 'auto'}
                            onPress={() => setAgentId(a.id)}
                            style={[styles.chip, agentId === a.id && styles.chipOn]}
                        >
                            <Text style={styles.chipText}>{a.name}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
                <TouchableOpacity style={styles.button} onPress={submit}>
                    <Text style={styles.buttonText}>Assign task</Text>
                </TouchableOpacity>
            </View>
            <FlatList
                data={tasks}
                keyExtractor={(t, i) => `${i}-${t.title}`}
                contentContainerStyle={{ padding: 12 }}
                ListEmptyComponent={<Text style={styles.empty}>No tasks yet.</Text>}
                renderItem={({ item }) => (
                    <View style={styles.card}>
                        <Text style={styles.title}>{item.title}</Text>
                        <Text style={styles.meta}>
                            {item.status}
                            {item.assignedTo ? ` · ${agents.find((a) => a.id === item.assignedTo)?.name ?? item.assignedTo}` : ''}
                        </Text>
                    </View>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    form: { padding: 12, borderBottomWidth: 1, borderColor: colors.border },
    input: { backgroundColor: colors.card, color: colors.text, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10 },
    chip: { borderWidth: 1, borderColor: colors.border, borderRadius: 16, paddingHorizontal: 12, paddingVertical: 6, marginRight: 8 },
    chipOn: { backgroundColor: colors.accent, borderColor: colors.accent },
    chipText: { color: colors.text },
    button: { backgroundColor: colors.accent, borderRadius: 10, paddingVertical: 10, alignItems: 'center' },
    buttonText: { color: '#fff', fontWeight: '700' },
    card: { backgroundColor: colors.card, borderColor: colors.border, borderWidth: 1, borderRadius: 12, padding: 12, marginBottom: 8 },
    title: { color: colors.text, fontWeight: '600' },
    meta: { color: colors.muted, marginTop: 2 },
    empty: { color: colors.muted, textAlign: 'center', marginTop: 40 },
});
