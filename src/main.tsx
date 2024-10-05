import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import 'react-toastify/dist/ReactToastify.css';
import "./index.css";
import App from './App';

import { ConsoleSpanExporter, SimpleSpanProcessor } from '@opentelemetry/sdk-trace-base'
import { WebTracerProvider } from '@opentelemetry/sdk-trace-web'
import { DocumentLoadInstrumentation } from '@opentelemetry/instrumentation-document-load'
import { registerInstrumentations } from '@opentelemetry/instrumentation'

// Creating a tracer provider instance.
const provider = new WebTracerProvider()
provider.addSpanProcessor(new SimpleSpanProcessor(new ConsoleSpanExporter()))

// Registering the provider for use with the OpenTelemetry API.
provider.register()

// Registering instrumentations. We can add as many as are needed.
registerInstrumentations({
  instrumentations: [new DocumentLoadInstrumentation()],
})


// Uncomment the following to register instrumentations to the console.
// provider.addSpanProcessor(
//   new SimpleSpanProcessor(
//     new ConsoleSpanExporter(),
//   ),
// )

// provider.register()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
