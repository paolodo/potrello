import { assetsMiddleware, prerenderedMiddleware, kitMiddleware } from './build/middlewares.js'

import Fastify from 'fastify'

import config from './api/config'
import buildAPIServer from './api/index.js'
import dotenv from 'dotenv'

dotenv.config()

async function build() {
	const fastify = Fastify({
		logger: {
			level: config.LOG_LEVEL,
			prettyPrint: config.PRETTY_PRINT
		}
	})

	await fastify.register(buildAPIServer, { prefix: '/api' })

	await fastify.register(import('fastify-express'))

	fastify.use(assetsMiddleware, prerenderedMiddleware, kitMiddleware)

	fastify.listen(3000)
}

build()
