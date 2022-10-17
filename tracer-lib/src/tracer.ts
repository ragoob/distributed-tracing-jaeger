import { JaegerExporter, ExporterConfig } from '@opentelemetry/exporter-jaeger';
import { Resource } from '@opentelemetry/resources';
import { SimpleSpanProcessor } from '@opentelemetry/sdk-trace-base';
import { NodeTracerProvider } from '@opentelemetry/sdk-trace-node';
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';
import { HttpInstrumentation } from '@opentelemetry/instrumentation-http';
import { ExpressInstrumentation } from '@opentelemetry/instrumentation-express';
import {registerInstrumentations} from '@opentelemetry/instrumentation'
import { PgInstrumentation } from '@opentelemetry/instrumentation-pg';
import { IORedisInstrumentation } from '@opentelemetry/instrumentation-ioredis';

export function init (serviceName: string, environment: string,config: ExporterConfig) {

    // Define traces
    const traceExporter = new JaegerExporter(config);
    const provider = new NodeTracerProvider({
        resource: new Resource({
            [SemanticResourceAttributes.SERVICE_NAME]: serviceName,
            [SemanticResourceAttributes.DEPLOYMENT_ENVIRONMENT]: environment,
        }),
    });
    provider.addSpanProcessor(new SimpleSpanProcessor(traceExporter));
    provider.register();
    registerInstrumentations({
        instrumentations: [
            new ExpressInstrumentation(),
            new HttpInstrumentation(),
            new PgInstrumentation(),
            new IORedisInstrumentation()

        ]
    });
    const tracer = provider.getTracer(serviceName);
    return { tracer };
}

