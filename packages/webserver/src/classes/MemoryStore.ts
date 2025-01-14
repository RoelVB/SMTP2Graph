/**
 * Memory based session store with cleanup (Fastify's built-in MemoryStore doesn't remove expired sessions from memory)
 */

import type { SessionStore } from '@fastify/session';
import type { Session } from 'fastify';
import { LRUCache } from 'lru-cache';

export interface IMemoryStoreOptions
{
	/** Session TTL (expiration) in milliseconds */
	ttl: number;
}

export class MemoryStore implements SessionStore
{
    #store: LRUCache<string, string>;

    constructor(options: IMemoryStoreOptions)
    {
        this.#store = new LRUCache({
            ttl: options.ttl,
            ttlAutopurge: true, 
        });
    }

    set(sessionId: string, session: Session, callback: (err?: any) => void): void
    {
        try {
            this.#store.set(sessionId, JSON.stringify(session));
            callback();
        } catch(error) {
            callback(error);
        }
    }

    get(sessionId: string, callback: (err: any, result?: Session | null | undefined) => void): void
    {
        const data = this.#store.get(sessionId);
        if(!data)
        {
            callback(null);
            return;
        }

        try {
            callback(null, JSON.parse(data));
        } catch(error) {
            callback(error);
        }
    }

    destroy(sessionId: string, callback: (err?: any) => void): void
    {
        try {
            this.#store.delete(sessionId);
        } catch(error) {
            callback(error);
        }
    }

}

export default MemoryStore;
