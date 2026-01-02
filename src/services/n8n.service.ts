import apiClient from './api-client';

const N8N_WEBHOOK_URL = import.meta.env.VITE_N8N_WEBHOOK_URL || '';

export interface FormSubmission {
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
  projectName: string;
  description: string;
  dueDate: string;
  file?: File | null;
}

/**
 * Submit form data to N8N webhook
 */
export const submitToN8N = async (data: FormSubmission) => {
  try {
    // If a file is included, convert to FormData
    if (data.file) {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          formData.append(key, value);
        }
      });
      
      const response = await apiClient.post(N8N_WEBHOOK_URL, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } else {
      // JSON submission without file
      const response = await apiClient.post(N8N_WEBHOOK_URL, data);
      return response.data;
    }
  } catch (error) {
    console.error('N8N submission error:', error);
    throw error;
  }
};

/**
 * Trigger a specific N8N workflow
 */
export const triggerN8NWorkflow = async (workflowId: string, data: any) => {
  try {
    const response = await apiClient.post(
      `${N8N_WEBHOOK_URL}/${workflowId}`,
      data
    );
    return response.data;
  } catch (error) {
    console.error('N8N workflow trigger error:', error);
    throw error;
  }
};
