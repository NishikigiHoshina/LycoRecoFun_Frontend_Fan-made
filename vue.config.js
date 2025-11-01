const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true
})
module.exports = {
  devServer: {
    host: '0.0.0.0',           // 允许局域网访问
    port: 8080,
    client: {
      webSocketURL: 'ws://localhost:8080/ws'   // 强制 localhost
    }
  }
}
