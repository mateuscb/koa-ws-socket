import * as compose from 'koa-compose';
import * as http from 'http';
import * as WebSocket from 'ws';
import { EventHandler, Middleware, SocketContext } from './index';

export default class Socket {
  middleware: compose.ComposedMiddleware<SocketContext> | null;
  ws: WebSocket;
  request: http.ServerRequest;

  constructor(
    ws: WebSocket,
    request: http.ServerRequest,
    listeners: Map<string, EventHandler[]>,
    middleware: Middleware | null
  ) {
    this.ws = ws;
    this.request = request;
    this.middleware = middleware;

    this.update(listeners, middleware);
  }

  update(
    listeners: Map<string, EventHandler[]>,
    middleware: Middleware | null
  ) {
    this.ws.removeAllListeners();
    this.middleware = middleware;

    listeners.forEach((handlers, event) => {
      if (event === 'connection') {
        return;
      }

      handlers.forEach(handler => {
        this.on(event, handler);
      });
    });
  }

  /**
   * Adds a specific event and callback to this socket
   */
  on(event: string, handler: EventHandler) {
    this.ws.on(event, (message: any) => {
      const ctx: SocketContext = {
        event,
        data: message,
        request: this.request,
        socket: this.ws,
      };

      if (!this.middleware) {
        handler(ctx, message);
        return;
      }

      this.middleware(ctx).then(() => {
        handler(ctx, message);
      });
    });
  }
}