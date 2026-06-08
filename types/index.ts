export type Role = 'ADMIN' | 'PROJECT_MANAGER' | 'TEAM_MEMBER';
export type ProjectStatus = 'ACTIVE' | 'COMPLETED' | 'ON_HOLD';
export type TaskPriority = 'HIGH' | 'MEDIUM' | 'LOW';
export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'COMPLETED';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar?: string;
  createdAt?: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  deadline?: string;
  status: ProjectStatus;
  createdById: string;
  createdAt: string;
  createdBy?: { id: string; name: string; avatar?: string };
  members?: ProjectMember[];
  tasks?: Task[];
  _count?: { tasks: number; members: number };
}

export interface ProjectMember {
  id: string;
  projectId: string;
  userId: string;
  user: User;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  projectId: string;
  assignedToId?: string;
  dueDate?: string;
  priority: TaskPriority;
  status: TaskStatus;
  createdById: string;
  createdAt: string;
  updatedAt: string;
  project?: { id: string; name: string };
  assignedTo?: { id: string; name: string; avatar?: string };
  createdBy?: { id: string; name: string };
  comments?: Comment[];
  attachments?: Attachment[];
}

export interface Comment {
  id: string;
  taskId: string;
  userId: string;
  content: string;
  createdAt: string;
  user: { id: string; name: string; avatar?: string };
}

export interface Attachment {
  id: string;
  taskId: string;
  fileUrl: string;
  fileName?: string;
  createdAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export interface ActivityLog {
  id: string;
  action: string;
  userId: string;
  projectId?: string;
  taskId?: string;
  createdAt: string;
  user: { id: string; name: string; avatar?: string };
  project?: { id: string; name: string };
  task?: { id: string; title: string };
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface DashboardData {
  kpis: {
    totalProjects: number;
    totalTasks: number;
    completedTasks: number;
    pendingTasks: number;
    overdueTasks: number;
  };
  charts: {
    tasksByPriority: { name: string; value: number }[];
    projectProgressTrend: { month: string; progress: number }[];
    teamProductivity: { week: string; completed: number; created: number }[];
    taskStatusDistribution: { name: string; value: number }[];
  };
  widgets: {
    recentActivities: ActivityLog[];
    upcomingDeadlines: Task[];
    highPriorityTasks: Task[];
    memberWorkload: MemberWorkload[];
    notifications: Notification[];
  };
}

export interface MemberWorkload {
  id: string;
  name: string;
  avatar?: string;
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  overdueTasks: number;
}
