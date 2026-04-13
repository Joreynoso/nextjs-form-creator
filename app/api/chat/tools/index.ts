import { createFormTool } from './createForm.tool'
import { findFormTool } from './findForm.tool'
import { generateFormTool } from './generateForm.tool'

export const tools = [createFormTool, findFormTool, generateFormTool]

export const toolExecutors: Record<string, (args: any, doctorId: string) => Promise<any>> = {
  createForm: (args, doctorId) => createFormTool.execute({ ...args, doctorId }),
  findForm: (args, doctorId) => findFormTool.execute({ ...args, doctorId }),
  generateForm: (args, _doctorId) => generateFormTool.execute(args),
}