import { WebSocketEventMap, WebSocketEventName, WebSocketListener } from '../../types/events';

type AnyListener = (data: any) => void;

class MockWebSocketClient {
  private connected: boolean = false;
  private listeners: Map<WebSocketEventName, Set<AnyListener>> = new Map();
  private reconnectTimer: number | null = null;

  constructor() {
    this.connected = true;
  }

  connect(_url: string = 'ws://192.168.10.10:8000/ws/inspection'): void {
    if (this.connected) return;
    this.connected = true;
    if (this.reconnectTimer) {
      window.clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
  }

  disconnect(): void {
    this.connected = false;
  }

  isConnected(): boolean {
    return this.connected;
  }

  subscribe<T extends WebSocketEventName>(
    event: T,
    listener: WebSocketListener<T>
  ): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    const set = this.listeners.get(event)!;
    set.add(listener as AnyListener);

    return () => {
      set.delete(listener as AnyListener);
    };
  }

  emit<T extends WebSocketEventName>(event: T, data: WebSocketEventMap[T]): void {
    if (!this.connected) return;
    const set = this.listeners.get(event);
    if (set) {
      set.forEach((listener) => {
        try {
          listener(data);
        } catch (err) {
          console.error(`Error in WebSocket listener for ${event}:`, err);
        }
      });
    }
  }
}

export const mockWebSocket = new MockWebSocketClient();
