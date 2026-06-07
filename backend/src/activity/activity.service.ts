import { Injectable } from "@nestjs/common";
import { initialActivities, Activity, CreateActivityDto, ActivityRegistration } from "./activity.data";

@Injectable()
export class ActivityService {
  private activities: Activity[] = [...initialActivities];

  getActivities() {
    return this.activities.map(({ registrations, ...activity }) => activity);
  }

  getActivityDetail(id: string) {
    return this.activities.find((a) => a.id === id);
  }

  createActivity(dto: CreateActivityDto) {
    const newActivity: Activity = {
      id: `act-${Date.now()}`,
      ...dto,
      status: "draft",
      currentParticipants: 0,
      registrations: [],
      createdAt: new Date().toISOString(),
    };
    this.activities.push(newActivity);
    return newActivity;
  }

  updateActivity(id: string, dto: Partial<CreateActivityDto>) {
    const index = this.activities.findIndex((a) => a.id === id);
    if (index === -1) return null;
    this.activities[index] = { ...this.activities[index], ...dto };
    return this.activities[index];
  }

  publishActivity(id: string) {
    const activity = this.activities.find((a) => a.id === id);
    if (!activity) return null;
    activity.status = "published";
    return activity;
  }

  endActivity(id: string) {
    const activity = this.activities.find((a) => a.id === id);
    if (!activity) return null;
    activity.status = "ended";
    return activity;
  }

  deleteActivity(id: string) {
    const index = this.activities.findIndex((a) => a.id === id);
    if (index === -1) return false;
    this.activities.splice(index, 1);
    return true;
  }

  registerActivity(id: string, registration: Omit<ActivityRegistration, "id" | "activityId" | "status" | "registeredAt">) {
    const activity = this.activities.find((a) => a.id === id);
    if (!activity) return null;
    if (activity.status !== "published") return null;
    if (activity.currentParticipants + registration.participants > activity.maxParticipants) {
      return { error: "活动名额不足" };
    }

    const newRegistration: ActivityRegistration = {
      id: `reg-${Date.now()}`,
      activityId: id,
      ...registration,
      status: "confirmed",
      registeredAt: new Date().toISOString(),
    };

    activity.registrations.push(newRegistration);
    activity.currentParticipants += registration.participants;
    return newRegistration;
  }

  getRegistrations(id: string) {
    const activity = this.activities.find((a) => a.id === id);
    if (!activity) return null;
    return activity.registrations;
  }

  cancelRegistration(activityId: string, registrationId: string) {
    const activity = this.activities.find((a) => a.id === activityId);
    if (!activity) return null;
    const regIndex = activity.registrations.findIndex((r) => r.id === registrationId);
    if (regIndex === -1) return null;
    activity.registrations[regIndex].status = "cancelled";
    activity.currentParticipants -= activity.registrations[regIndex].participants;
    return activity.registrations[regIndex];
  }

  getActivityStats() {
    const total = this.activities.length;
    const published = this.activities.filter((a) => a.status === "published").length;
    const draft = this.activities.filter((a) => a.status === "draft").length;
    const ended = this.activities.filter((a) => a.status === "ended").length;
    const totalRegistrations = this.activities.reduce((sum, a) => sum + a.registrations.length, 0);
    return { total, published, draft, ended, totalRegistrations };
  }
}
