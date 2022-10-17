import * as api from '@opentelemetry/api'
export interface ITracer {
    addEvent(name: string, attributes?: api.Attributes | api.TimeInput | undefined, startTime?: api.TimeInput | undefined): void;
    recordException(exception: api.Exception | any, time?: api.TimeInput | undefined): void;
    getActiveSpan(): api.Span  | undefined;
    getTraceId(): string | undefined;
}