import { useCallback, useEffect, useRef, useState } from 'react';
import { Client, Room } from 'colyseus.js';

export interface AgentInfo {
    id: string;
    name: string;
    action: string;
    currentTask: string;
    thought: string;
    mood: number;
    reputation: number;
}

export interface ChatMessage {
    sender: string;
    text: string;
}

export interface Task {
    title: string;
    status: string;
    assignedTo: string;
}

export type ConnectionStatus = 'connecting' | 'connected' | 'error';

const MAX_CHAT = 200;

/** Connects to the AgentOffice Colyseus server and exposes live state. */
export function useOffice(endpoint: string) {
    const roomRef = useRef<Room | null>(null);
    const [status, setStatus] = useState<ConnectionStatus>('connecting');
    const [error, setError] = useState('');
    const [agents, setAgents] = useState<AgentInfo[]>([]);
    const [chat, setChat] = useState<ChatMessage[]>([]);
    const [tasks, setTasks] = useState<Task[]>([]);

    useEffect(() => {
        let cancelled = false;
        setStatus('connecting');
        setError('');

        const syncAgents = (room: Room) => {
            const list: AgentInfo[] = [];
            room.state.agents.forEach((a: any) => {
                list.push({
                    id: a.id,
                    name: a.name,
                    action: a.action,
                    currentTask: a.currentTask,
                    thought: a.thought,
                    mood: a.mood,
                    reputation: a.reputation,
                });
            });
            setAgents(list);
        };

        new Client(endpoint)
            .joinOrCreate('office')
            .then((room) => {
                if (cancelled) {
                    room.leave();
                    return;
                }
                roomRef.current = room;
                setStatus('connected');
                room.onStateChange(() => syncAgents(room));
                room.onMessage('chat', (m: ChatMessage) =>
                    setChat((prev) => [...prev, m].slice(-MAX_CHAT))
                );
                room.onMessage('tasks-sync', (rows: any[]) =>
                    setTasks(
                        rows.map((t) => ({
                            title: t.title,
                            status: t.status ?? 'pending',
                            assignedTo: t.assigned_to ?? '',
                        }))
                    )
                );
                room.onMessage('task-update', (d: any) =>
                    setTasks((prev) => {
                        const i = prev.findIndex((t) => t.title === d.task);
                        const row: Task = { title: d.task, status: d.status, assignedTo: d.agentId ?? '' };
                        if (i < 0) return [row, ...prev];
                        const next = prev.slice();
                        next[i] = { ...next[i], ...row };
                        return next;
                    })
                );
                room.onLeave(() => !cancelled && setStatus('error'));
            })
            .catch((e) => {
                if (cancelled) return;
                setStatus('error');
                setError(String(e?.message ?? e));
            });

        return () => {
            cancelled = true;
            roomRef.current?.leave();
            roomRef.current = null;
        };
    }, [endpoint]);

    const sendChat = useCallback((text: string) => {
        roomRef.current?.send('chat', { text });
    }, []);

    const assignTask = useCallback((title: string, agentId?: string) => {
        roomRef.current?.send('assign-task', { title, agentId });
    }, []);

    return { status, error, agents, chat, tasks, sendChat, assignTask };
}
