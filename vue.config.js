module.exports = {
    configureWebpack: {
        resolve: {
            alias: {
                //默认@：对应src
                assets: '@/assets',
                components: '@/components',
                network: '@/network',
                views: '@/views',
            }

        }
    }
}