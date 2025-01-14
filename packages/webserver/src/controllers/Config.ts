import { FastifyInstance } from "fastify";
import { Config, IConfig } from "@smtp2graph/common/src/Config";
import { deepMerge } from "@smtp2graph/common/src/Utils";

export function configController(server: FastifyInstance, baseUrl = '/config')
{
    // Get current config
    server.get<{
        Reply: {200: IConfig},
    }>(baseUrl, async (request, reply)=>{
        return reply.code(200).send(new Config().config)
    });

    // Update config
    server.post<{
        Body: IConfig,
        Reply: {200: IConfig, '4xx': {error: string}, '5xx': {error: string}},
    }>(baseUrl, async (request, reply)=>{
        const newConfig = new Config(deepMerge(new Config().config, request.body));

        try {
            newConfig.validate();
        } catch(error) {
            return reply.status(400).send({error: `Invalid config. ${String(error)}`});
        }

        try {
            newConfig.save();
            return reply.status(200).send(newConfig.config);
        } catch(error) {
            return reply.status(500).send({error: `Failed to save config. ${String(error)}`});
        }
    });
}

export default configController;
