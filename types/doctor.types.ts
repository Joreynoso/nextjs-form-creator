import { FormResponse } from "./submission.types"

export interface Doctor {
  id: string;
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  createdAt: Date;
}

export interface Patient {
  id: string;
  token: string;
  doctorId: string;
  formId: string;
  firstName?: string;
  lastName?: string;
  formResponses?: FormResponse;
  formCompleted: boolean;
  completedAt?: Date;
  createdAt: Date;
  linkSentAt: Date;
}
