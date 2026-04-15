export type SubmissionStatus = "pending" | "completed" | "expired" | "cancelled"

export interface Submission {
  id: string;
  formId: string;
  responses: FormResponse;
  status: SubmissionStatus;
  createdAt: Date;
  completedAt?: Date | null;
}

export interface SubmissionStatusInfo {
  label: string;
  class: string;
}

export interface FormResponse {
  [fieldId: string]: FieldValue
}

export type FieldValue =
  | string
  | number
  | boolean
  | string[]
  | null
  | undefined

