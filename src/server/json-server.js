// json-server.js
import jsonServer from 'json-server';
const server = jsonServer.create();
const router = jsonServer.router('src/server/db.json');
const middlewares = jsonServer.defaults();
const port = 3000;

const routes= {
    "/api/v1/*": "/$1"
}

server.use(middlewares);

server.use(jsonServer.bodyParser);

server.use(jsonServer.rewriter(routes));

server.use(router);

server.listen(port, () => {
console.log(`JSON Server listening => http://localhost:${port}`);
});

