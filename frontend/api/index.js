function buildAPIServer(fastify, options, done) {
	fastify.register(import('fastify-mongodb'), {
		forceClose: true,
		url: process.env.DB_URL
	})

	fastify.register(import('./plugins/authenticate.js'))
	fastify.register(import('./routes/users.js'))

	fastify.get('/ping', (_, reply) => {
		reply.code(200).send({ message: 'pong' })
	})

	done()
}

export default buildAPIServer
