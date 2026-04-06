import { createFormTool } from './createForm.tool'
import { findFormTool } from './findForm.tool'

export const tools = [createFormTool, findFormTool]

export const toolExecutors: Record<string, (args: any, doctorId: string) => Promise<any>> = {
  createForm: (args, doctorId) => createFormTool.execute({ ...args, doctorId }),
  findForm: (args, doctorId) => findFormTool.execute({ ...args, doctorId }),
}