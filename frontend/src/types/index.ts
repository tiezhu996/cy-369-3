export interface FeatureItem {
  id: number;
  title: string;
  description: string;
  status: string;
  metric: string;
}

export interface KpiItem {
  label: string;
  value: string;
  trend: string;
  tone: string;
}

export interface OperationRecord {
  key: string;
  name: string;
  owner: string;
  status: string;
  metric: string;
  priority: string;
}

export interface OverviewResponse {
  appName: string;
  appCode: string;
  description: string;
  features: FeatureItem[];
  kpis: KpiItem[];
  records: OperationRecord[];
}

export interface Activity {
  id: string;
  name: string;
  description: string;
  startTime: string;
  endTime: string;
  location: string;
  maxParticipants: number;
  fee: number;
  status: "draft" | "published" | "ended";
  currentParticipants: number;
  createdAt: string;
}

export interface ActivityRegistration {
  id: string;
  activityId: string;
  name: string;
  phone: string;
  participants: number;
  status: "pending" | "confirmed" | "cancelled";
  registeredAt: string;
}

export interface ActivityDetail extends Activity {
  registrations: ActivityRegistration[];
}

export interface ActivityStats {
  total: number;
  published: number;
  draft: number;
  ended: number;
  totalRegistrations: number;
}

export interface CreateActivityRequest {
  name: string;
  description: string;
  startTime: string;
  endTime: string;
  location: string;
  maxParticipants: number;
  fee: number;
}
