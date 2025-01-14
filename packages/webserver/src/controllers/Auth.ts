import { FastifyInstance } from "fastify";
import fastifyCookie from '@fastify/cookie';
import fastifySession from '@fastify/session';
import Users from "@smtp2graph/common/src/Users";
import MemoryStore from "../classes/MemoryStore";

declare module 'fastify' {
    interface Session {
        user?: string;
    }
}

export function authController(server: FastifyInstance, baseUrl = '/auth')
{
    server.register(fastifyCookie);
    server.register(fastifySession, {
        secret: '092361c3-64e9-4bcd-8c8f-c6667144468f',
        cookie: {secure: false},
        saveUninitialized: false,
        store: new MemoryStore({
            ttl: 3600000 // 1h (after inactivity)
        }),
    });

    // Check for active session
    server.addHook('preHandler', async (request, reply)=>{
        if(!request.url.toLowerCase().startsWith(baseUrl) && typeof request.session.user !== 'string') // Visiting /auth OR not logged in
            return reply.code(403).send();
    });

    // Get current user/session
    server.get<{
        Reply: {200: {user: string}, '4xx': {}},
    }>(baseUrl, async (request, reply)=>{
        if(typeof request.session.user === 'string')
            return reply.code(200).send({user: request.session.user});
        else
            return reply.code(403).send();
    });

    // Login
    server.post<{
        Body: {user: string, password: string},
        Reply: {200: {user: string}, '4xx': {error: string}},
    }>(baseUrl, async (request, reply)=>{
        if(typeof request.body.user !== 'string' || typeof request.body.password !== 'string') // Did we get receive username and password?
            return reply.code(400).send({error: 'Invalid request'});

        if(Users.validate(request.body.user, request.body.password))
        {
            request.session.user = request.body.user;
            return reply.code(200).send({user: request.body.user});
        }
        else
            return reply.code(401).send({error: 'Invalid username and/or password'});
    });
}

export default authController;
