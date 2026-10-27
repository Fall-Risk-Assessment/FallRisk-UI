import { createContext, useContext } from 'react';

export const WorkflowContext = createContext(null);
export const useWorkflow = () => useContext(WorkflowContext);
