import { Get, JsonController } from 'routing-controllers'
import { RouteGuideService } from '../service/routeGuideService'


@JsonController('/route-guide2')
export class RouteGuide {
    routeGuideService: RouteGuideService
    constructor() {
        this.routeGuideService = new RouteGuideService()
    }
    @Get('/getFeature')
    async getFeature() {
        const result = await this.routeGuideService.getFeature()

        return result
    }

    @Get('/listFeatures')
    async listFeatures() {
        const result = await this.routeGuideService.listFeatures()
        return result
    }

    @Get('/recordRoute')
    async recordRoute() {
        const result = await this.routeGuideService.recordRoute()
        return result
    }


    @Get('/routeChat')
    async routeChat() {
        const result = await this.routeGuideService.routeChat()
        return result
    }
}