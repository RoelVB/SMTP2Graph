import { FastifyInstance } from "fastify";
import authController from "./Auth";
import configController from "./Config";

export function initControlers(server: FastifyInstance)
{
    authController(server);
    configController(server);

    server.setNotFoundHandler((request, reply)=>{
        reply.code(404).send({error: 'Page not found'});
    });
}

export default initControlers;
