import React, { useRef, useState } from 'react';
import { FlatList, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { ChatMessage } from './useOffice';
import { colors } from './theme';

export function ChatScreen({ chat, onSend }: { chat: ChatMessage[]; onSend: (t: string) => void }) {
    const [text, setText] = useState('');
    const list = useRef<FlatList<ChatMessage>>(null);

    const submit = () => {
        const t = text.trim();
        if (!t) return;
        onSend(t);
        setText('');
    };

    return (
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined} keyboardVerticalOffset={90}>
            <FlatList
                ref={list}
                data={chat}
                keyExtractor={(_, i) => String(i)}
                contentContainerStyle={{ padding: 12 }}
                onContentSizeChange={() => list.current?.scrollToEnd({ animated: true })}
                ListEmptyComponent={<Text style={styles.empty}>No messages yet.</Text>}
                renderItem={({ item }) => (
                    <View style={styles.msg}>
                        <Text style={styles.sender}>{item.sender}</Text>
                        <Text style={styles.body}>{item.text}</Text>
                    </View>
                )}
            />
            <View style={styles.inputRow}>
                <TextInput
                    style={styles.input}
                    value={text}
                    onChangeText={setText}
                    onSubmitEditing={submit}
                    placeholder="Message the office…"
                    placeholderTextColor={colors.muted}
                    returnKeyType="send"
                />
                <TouchableOpacity style={styles.send} onPress={submit}>
                    <Text style={styles.sendText}>Send</Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    msg: { marginBottom: 10 },
    sender: { color: colors.accent, fontWeight: '700', marginBottom: 2 },
    body: { color: colors.text },
    inputRow: { flexDirection: 'row', padding: 10, borderTopWidth: 1, borderColor: colors.border },
    input: { flex: 1, backgroundColor: colors.card, color: colors.text, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10 },
    send: { backgroundColor: colors.accent, borderRadius: 10, marginLeft: 8, paddingHorizontal: 16, justifyContent: 'center' },
    sendText: { color: '#fff', fontWeight: '700' },
    empty: { color: colors.muted, textAlign: 'center', marginTop: 40 },
});
