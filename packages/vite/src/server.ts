import connect from 'connect'

async function resolveHttpServer(serverConfig, app){
    const { createServer } = await import('node:http')
    return createServer(app)

}


async function createServer(inlineConfig = {}){
    // const config = await resolveConfig(inlineConfig, 'serve')
    // const { root, server: serverConfig } = config

    const serverConfig = {}
    const middlewares = connect()
    const httpServer = await resolveHttpServer(serverConfig, middlewares)


    
    httpServer.listen(port, host, () => {
    })
}

// 启动服务并检查端口哦
export async function httpServerStart(
    httpServer: HttpServer,
    serverOptions: {
      port: number
      strictPort: boolean | undefined
      host: string | undefined
      logger: Logger
    },
  ): Promise<number> {
    let { port, strictPort, host, logger } = serverOptions
  
    return new Promise((resolve, reject) => {
      const onError = (e: Error & { code?: string }) => {
        if (e.code === 'EADDRINUSE') {
          if (strictPort) {
            httpServer.removeListener('error', onError)
            reject(new Error(`Port ${port} is already in use`))
          } else {
            logger.info(`Port ${port} is in use, trying another one...`)
            httpServer.listen(++port, host)
          }
        } else {
          httpServer.removeListener('error', onError)
          reject(e)
        }
      }
  
      httpServer.on('error', onError)
  
      httpServer.listen(port, host, () => {
        httpServer.removeListener('error', onError)
        resolve(port)
      })
    })
  }
  