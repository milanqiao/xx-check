import { viteMockServe } from 'vite-plugin-mock';

export function configMockPlugin(isBuild, prodMock) {
    return viteMockServe({
        // 模拟服务的文件夹，在设置了configPath后失效
        mockPath: 'mock'
    });
}