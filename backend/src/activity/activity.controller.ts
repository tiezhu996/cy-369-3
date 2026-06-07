import { Controller, Get, Post, Put, Delete, Body, Param } from "@nestjs/common";
import { ActivityService } from "./activity.service";
import { CreateActivityDto } from "./activity.data";

@Controller()
export class ActivityController {
  constructor(private readonly activityService: ActivityService) {}

  @Get("activities")
  getActivities() {
    return this.activityService.getActivities();
  }

  @Get("api/activities")
  apiGetActivities() {
    return this.activityService.getActivities();
  }

  @Get("activities/stats")
  getActivityStats() {
    return this.activityService.getActivityStats();
  }

  @Get("api/activities/stats")
  apiGetActivityStats() {
    return this.activityService.getActivityStats();
  }

  @Get("activities/:id")
  getActivityDetail(@Param("id") id: string) {
    return this.activityService.getActivityDetail(id);
  }

  @Get("api/activities/:id")
  apiGetActivityDetail(@Param("id") id: string) {
    return this.activityService.getActivityDetail(id);
  }

  @Post("activities")
  createActivity(@Body() dto: CreateActivityDto) {
    return this.activityService.createActivity(dto);
  }

  @Post("api/activities")
  apiCreateActivity(@Body() dto: CreateActivityDto) {
    return this.activityService.createActivity(dto);
  }

  @Put("activities/:id")
  updateActivity(@Param("id") id: string, @Body() dto: Partial<CreateActivityDto>) {
    return this.activityService.updateActivity(id, dto);
  }

  @Put("api/activities/:id")
  apiUpdateActivity(@Param("id") id: string, @Body() dto: Partial<CreateActivityDto>) {
    return this.activityService.updateActivity(id, dto);
  }

  @Post("activities/:id/publish")
  publishActivity(@Param("id") id: string) {
    return this.activityService.publishActivity(id);
  }

  @Post("api/activities/:id/publish")
  apiPublishActivity(@Param("id") id: string) {
    return this.activityService.publishActivity(id);
  }

  @Post("activities/:id/end")
  endActivity(@Param("id") id: string) {
    return this.activityService.endActivity(id);
  }

  @Post("api/activities/:id/end")
  apiEndActivity(@Param("id") id: string) {
    return this.activityService.endActivity(id);
  }

  @Delete("activities/:id")
  deleteActivity(@Param("id") id: string) {
    return this.activityService.deleteActivity(id);
  }

  @Delete("api/activities/:id")
  apiDeleteActivity(@Param("id") id: string) {
    return this.activityService.deleteActivity(id);
  }

  @Get("activities/:id/registrations")
  getRegistrations(@Param("id") id: string) {
    return this.activityService.getRegistrations(id);
  }

  @Get("api/activities/:id/registrations")
  apiGetRegistrations(@Param("id") id: string) {
    return this.activityService.getRegistrations(id);
  }

  @Post("activities/:id/register")
  registerActivity(
    @Param("id") id: string,
    @Body() registration: { name: string; phone: string; participants: number }
  ) {
    return this.activityService.registerActivity(id, registration);
  }

  @Post("api/activities/:id/register")
  apiRegisterActivity(
    @Param("id") id: string,
    @Body() registration: { name: string; phone: string; participants: number }
  ) {
    return this.activityService.registerActivity(id, registration);
  }

  @Post("activities/:id/registrations/:registrationId/cancel")
  cancelRegistration(@Param("id") activityId: string, @Param("registrationId") registrationId: string) {
    return this.activityService.cancelRegistration(activityId, registrationId);
  }

  @Post("api/activities/:id/registrations/:registrationId/cancel")
  apiCancelRegistration(@Param("id") activityId: string, @Param("registrationId") registrationId: string) {
    return this.activityService.cancelRegistration(activityId, registrationId);
  }
}
