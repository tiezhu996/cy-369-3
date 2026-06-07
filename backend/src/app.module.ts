import { Module } from "@nestjs/common";
import { OverviewController } from "./overview/overview.controller";
import { OverviewService } from "./overview/overview.service";
import { ActivityController } from "./activity/activity.controller";
import { ActivityService } from "./activity/activity.service";
import { AppLogger } from "./common/app.logger";

@Module({
  controllers: [OverviewController, ActivityController],
  providers: [OverviewService, ActivityService, AppLogger],
})
export class AppModule {}
