// This file contains utility functions for logging errors to a centralized logging service like Sentry.

import * as Sentry from '@sentry/nextjs';

/**
 * Initializes Sentry for error tracking.
 * @param {string} dsn - The Data Source Name for Sentry.
 */
export const initSentry = (dsn: string) => {
    if (!dsn) return;
    Sentry.init({
        dsn,
        tracesSampleRate: 1.0, // Adjust this value in production
    });
};

/**
 * Logs an error to Sentry.
 * @param {Error} error - The error object to log.
 * @param {string} [context] - Optional context to provide additional information about the error.
 */
export const logError = (error: Error, context?: string) => {
    Sentry.captureException(error, {
        extra: { context },
    });
};

/**
 * Logs a message to Sentry.
 * @param {string} message - The message to log.
 * @param {string} [level='info'] - The level of the message (e.g., 'info', 'warning', 'error').
 */
export const logMessage = (message: string, level: 'info' | 'warning' | 'error' = 'info') => {
    Sentry.captureMessage(message, level);
};