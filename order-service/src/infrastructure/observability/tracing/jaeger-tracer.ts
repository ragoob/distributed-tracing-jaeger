import * as api from '@opentelemetry/api'
import { Tracer } from '@opentelemetry/api';
import { ITracer } from '@infrastructure/observability/tracing/open-telemetry-tracer.interface';

export class JaegerTracer implements ITracer {
    private readonly tracer: Tracer
    constructor(tracer: Tracer){
        this.tracer = tracer;
    }
    getTraceId(): string | undefined {
       return this.getActiveSpan()?.spanContext().traceId;
    }
    getActiveSpan(): api.Span | undefined {
        const activeSpan = api.trace.getSpan(api.context.active());
        return activeSpan;
    }
    addEvent(name: string, attributes?: api.Attributes | api.TimeInput | undefined, startTime?: api.TimeInput | undefined): void{
        
        this.getActiveSpan()?.addEvent(name,attributes,startTime)
    }

    recordException(exception: api.Exception, time?: api.TimeInput | undefined): void{
        this.getActiveSpan()?.recordException(exception,time);
    }
}