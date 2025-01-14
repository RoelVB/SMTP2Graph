import fastify from 'fastify'
import { log } from './classes/Constants';
import initControlers from './controllers';

const server = fastify();

initControlers(server);

(async ()=>{
    try {
        await server.listen({ port: 8080 }); // TODO: Variable port
        log('info', `Webserver started on port 8080`); // TODO: Variable port
    } catch(error) {
        log('error', 'Failed to start webserver', {error});
        process.exit(1);
    }
})();
