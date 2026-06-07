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
  registrations: ActivityRegistration[];
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

export interface CreateActivityDto {
  name: string;
  description: string;
  startTime: string;
  endTime: string;
  location: string;
  maxParticipants: number;
  fee: number;
}

export const initialActivities: Activity[] = [
  {
    id: "act-1",
    name: "篝火晚会",
    description: "营地每周六晚举办篝火晚会，围坐篝火旁唱歌跳舞，享受户外夜晚的美好时光。提供免费烤串和饮料。",
    startTime: "2026-06-13T19:30:00",
    endTime: "2026-06-13T22:00:00",
    location: "中央篝火广场",
    maxParticipants: 50,
    fee: 68,
    status: "published",
    currentParticipants: 36,
    createdAt: "2026-06-01T10:00:00",
    registrations: [
      {
        id: "reg-1",
        activityId: "act-1",
        name: "张先生",
        phone: "138****1234",
        participants: 3,
        status: "confirmed",
        registeredAt: "2026-06-05T14:30:00",
      },
      {
        id: "reg-2",
        activityId: "act-1",
        name: "李女士",
        phone: "139****5678",
        participants: 2,
        status: "confirmed",
        registeredAt: "2026-06-06T09:15:00",
      },
      {
        id: "reg-3",
        activityId: "act-1",
        name: "王先生",
        phone: "137****9012",
        participants: 4,
        status: "pending",
        registeredAt: "2026-06-07T11:20:00",
      },
    ],
  },
  {
    id: "act-2",
    name: "星空观测活动",
    description: "专业天文爱好者带领，使用高倍望远镜观测星空，讲解星座知识，适合亲子参与。",
    startTime: "2026-06-14T21:00:00",
    endTime: "2026-06-14T23:00:00",
    location: "山顶观星台",
    maxParticipants: 30,
    fee: 88,
    status: "published",
    currentParticipants: 18,
    createdAt: "2026-06-02T15:00:00",
    registrations: [
      {
        id: "reg-4",
        activityId: "act-2",
        name: "陈女士",
        phone: "136****3456",
        participants: 2,
        status: "confirmed",
        registeredAt: "2026-06-06T16:45:00",
      },
    ],
  },
  {
    id: "act-3",
    name: "户外电影之夜",
    description: "露天大荧幕播放经典电影，提供躺椅和毛毯，感受不一样的观影体验。",
    startTime: "2026-06-15T20:00:00",
    endTime: "2026-06-15T22:30:00",
    location: "草坪影院区",
    maxParticipants: 80,
    fee: 48,
    status: "draft",
    currentParticipants: 0,
    createdAt: "2026-06-03T08:00:00",
    registrations: [],
  },
];
