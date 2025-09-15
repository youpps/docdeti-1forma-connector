import moment from "moment";
import { IVisitDialogMessage } from "../types/visitDialogMessage";

interface OneFormaConfig {
  getTokenUrl?: string;
  createTaskUrl?: string;
  login: string;
  password: string;
  subcatId?: number;
  defaultUserId?: number;
}

interface TaskData {
  subcatId: number;
  taskText: string;
  orderedTime: string;
  performerIds: number[];
  priorityId: number;
  userToMakeOwnerId: number;
  subscriberIds: number[];
  notifyIds: number[];
  initiatorUserId: number;
  taskStartTime: string;
  userComment: string;
  extParams: Array<{ id: number; value: string }>;
}

interface ComplaintData {
  fullname: string;
  phone: string;
  date: string;
  summary: string;
  dialog: IVisitDialogMessage[];
}

export interface OneFormaRepositoryConstructor {
  login: string;
  password: string;
  defaultUserId: number;
  subcatId: number;
  url: string;
}

class OneFormaRepository {
  private readonly config: Required<OneFormaConfig>;

  constructor(config: OneFormaRepositoryConstructor) {
    this.config = this.initializeConfig(config);
  }

  private initializeConfig(config: OneFormaRepositoryConstructor): Required<OneFormaConfig> {
    const { url, ...rest } = config;

    return {
      ...rest,
      getTokenUrl: `${url}/app/v1.0/api/auth/token`,
      createTaskUrl: `${url}/api/tasks/create`,
    };
  }

  private async fetchWithErrorHandling<T>(url: string, options: RequestInit): Promise<T> {
    const response = await fetch(url, options);

    if (!response.ok) {
      const errorData = await response.text().catch(() => ({}));
      throw new Error(`HTTP error ${response.status}: ${errorData || "Unknown error"}`);
    }

    return response.json();
  }

  private formatDialog(summary: string, dialog: IVisitDialogMessage[]): string {
    const messages = dialog.map(({ sender, text }) => `${sender}:\n${text}`);
    return `Сводка:\n${summary}\n\nПереписка:\n${messages.join("\n\n")}`;
  }

  private async getAuthToken(): Promise<string> {
    const params = new URLSearchParams({
      login: this.config.login,
      password: this.config.password,
      isPersistent: "true",
    });

    const url = `${this.config.getTokenUrl}?${params.toString()}`;
    const token = await this.fetchWithErrorHandling<string>(url, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    return token;
  }

  private buildTaskPayload(complaintData: ComplaintData): Partial<TaskData> {
    const taskStartTime = moment();
    const orderedTime = taskStartTime.add("d", 1);

    const { fullname, phone, date, summary, dialog } = complaintData;

    return {
      subcatId: this.config.subcatId,
      priorityId: 1,
      userToMakeOwnerId: this.config.defaultUserId,
      notifyIds: [this.config.defaultUserId],
      initiatorUserId: this.config.defaultUserId,
      userComment: "Задача создана автоматически через API",
      taskText: this.formatDialog(summary, dialog),
      orderedTime: orderedTime.toISOString(),
      taskStartTime: taskStartTime.toISOString(),
      performerIds: [],
      subscriberIds: [],
      extParams: [
        { id: 443, value: fullname },
        { id: 200, value: phone },
        { id: 335, value: date },
      ],
    };
  }

  async saveFeedback(complaintData: ComplaintData): Promise<number> {
    const token = await this.getAuthToken();
    const taskPayload = this.buildTaskPayload(complaintData);

    const res = await this.fetchWithErrorHandling<{ data: { value: number } }>(this.config.createTaskUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "1formaauth": token,
      },
      body: JSON.stringify(taskPayload),
    });

    return res.data.value;
  }
}

export { OneFormaRepository };
