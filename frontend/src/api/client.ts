import { API_BASE_URL } from "../constants/app";
import type {
  OverviewResponse,
  Activity,
  ActivityDetail,
  ActivityStats,
  ActivityRegistration,
  CreateActivityRequest,
} from "../types";

export async function fetchOverview(): Promise<OverviewResponse> {
  const response = await fetch(`${API_BASE_URL}/overview`, {
    headers: { Accept: "application/json" },
  });

  if (!response.ok) {
    throw new Error(`Overview request failed: ${response.status}`);
  }

  return response.json() as Promise<OverviewResponse>;
}

export async function fetchActivities(): Promise<Activity[]> {
  const response = await fetch(`${API_BASE_URL}/activities`, {
    headers: { Accept: "application/json" },
  });

  if (!response.ok) {
    throw new Error(`Activities request failed: ${response.status}`);
  }

  return response.json() as Promise<Activity[]>;
}

export async function fetchActivityStats(): Promise<ActivityStats> {
  const response = await fetch(`${API_BASE_URL}/activities/stats`, {
    headers: { Accept: "application/json" },
  });

  if (!response.ok) {
    throw new Error(`Activity stats request failed: ${response.status}`);
  }

  return response.json() as Promise<ActivityStats>;
}

export async function fetchActivityDetail(id: string): Promise<ActivityDetail> {
  const response = await fetch(`${API_BASE_URL}/activities/${id}`, {
    headers: { Accept: "application/json" },
  });

  if (!response.ok) {
    throw new Error(`Activity detail request failed: ${response.status}`);
  }

  return response.json() as Promise<ActivityDetail>;
}

export async function createActivity(data: CreateActivityRequest): Promise<Activity> {
  const response = await fetch(`${API_BASE_URL}/activities`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`Create activity failed: ${response.status}`);
  }

  return response.json() as Promise<Activity>;
}

export async function updateActivity(id: string, data: Partial<CreateActivityRequest>): Promise<Activity> {
  const response = await fetch(`${API_BASE_URL}/activities/${id}`, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`Update activity failed: ${response.status}`);
  }

  return response.json() as Promise<Activity>;
}

export async function publishActivity(id: string): Promise<Activity> {
  const response = await fetch(`${API_BASE_URL}/activities/${id}/publish`, {
    method: "POST",
    headers: { Accept: "application/json" },
  });

  if (!response.ok) {
    throw new Error(`Publish activity failed: ${response.status}`);
  }

  return response.json() as Promise<Activity>;
}

export async function endActivity(id: string): Promise<Activity> {
  const response = await fetch(`${API_BASE_URL}/activities/${id}/end`, {
    method: "POST",
    headers: { Accept: "application/json" },
  });

  if (!response.ok) {
    throw new Error(`End activity failed: ${response.status}`);
  }

  return response.json() as Promise<Activity>;
}

export async function deleteActivity(id: string): Promise<boolean> {
  const response = await fetch(`${API_BASE_URL}/activities/${id}`, {
    method: "DELETE",
    headers: { Accept: "application/json" },
  });

  if (!response.ok) {
    throw new Error(`Delete activity failed: ${response.status}`);
  }

  return response.json() as Promise<boolean>;
}

export async function fetchRegistrations(activityId: string): Promise<ActivityRegistration[]> {
  const response = await fetch(`${API_BASE_URL}/activities/${activityId}/registrations`, {
    headers: { Accept: "application/json" },
  });

  if (!response.ok) {
    throw new Error(`Registrations request failed: ${response.status}`);
  }

  return response.json() as Promise<ActivityRegistration[]>;
}

export async function registerActivity(
  activityId: string,
  data: { name: string; phone: string; participants: number }
): Promise<ActivityRegistration | { error: string }> {
  const response = await fetch(`${API_BASE_URL}/activities/${activityId}/register`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`Register activity failed: ${response.status}`);
  }

  return response.json() as Promise<ActivityRegistration | { error: string }>;
}

export async function cancelRegistration(
  activityId: string,
  registrationId: string
): Promise<ActivityRegistration> {
  const response = await fetch(
    `${API_BASE_URL}/activities/${activityId}/registrations/${registrationId}/cancel`,
    {
      method: "POST",
      headers: { Accept: "application/json" },
    }
  );

  if (!response.ok) {
    throw new Error(`Cancel registration failed: ${response.status}`);
  }

  return response.json() as Promise<ActivityRegistration>;
}
