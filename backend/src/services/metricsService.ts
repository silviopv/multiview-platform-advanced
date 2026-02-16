import client from 'prom-client';

const register = new client.Registry();

client.collectDefaultMetrics({ register });

export const httpRequestDuration = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.01, 0.05, 0.1, 0.5, 1, 2, 5],
  registers: [register],
});

export const httpRequestTotal = new client.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status_code'],
  registers: [register],
});

export const activeStreams = new client.Gauge({
  name: 'active_streams_total',
  help: 'Number of currently active streams',
  registers: [register],
});

export const activeRecordings = new client.Gauge({
  name: 'active_recordings_total',
  help: 'Number of currently active recordings',
  registers: [register],
});

export const connectedClients = new client.Gauge({
  name: 'connected_websocket_clients',
  help: 'Number of connected WebSocket clients',
  registers: [register],
});

export const streamErrors = new client.Counter({
  name: 'stream_errors_total',
  help: 'Total number of stream errors',
  labelNames: ['stream_id', 'error_type'],
  registers: [register],
});

export { register };
