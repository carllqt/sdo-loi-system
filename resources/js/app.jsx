import '../css/app.css';
import './bootstrap';

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import { GooeyToaster, gooeyToast } from 'goey-toast';
import ToastContext from './Components/ToastContext';
import 'goey-toast/styles.css';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';
const toastDuration = 5000;
const toast = gooeyToast;

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.jsx`,
            import.meta.glob('./Pages/**/*.jsx'),
        ),
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(
            <>
                <ToastContext.Provider value={toast}>
                    <App {...props} />
                </ToastContext.Provider>
                <GooeyToaster
                    position="top-center"
                    theme="dark"
                    duration={toastDuration}
                    spring
                    bounce={0.4}
                    showProgress
                    showTimestamp
                    closeOnEscape
                    closeButton="top-right"
                />
            </>,
        );
    },
    progress: {
        color: '#4B5563',
    },
});
