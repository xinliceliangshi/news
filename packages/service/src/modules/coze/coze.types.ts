export type RunCozeWorkflowBody = {
  topic?: string;
  side?: string;
  mbti?: string;
};

export type CozeWorkflowUsage = {
  input_count?: number;
  output_count?: number;
  token_count?: number;
};

export type CozeWorkflowResult = {
  output: string;
  executeId?: string;
  debugUrl?: string;
  usage?: CozeWorkflowUsage;
};
