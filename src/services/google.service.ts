import apiClient from '../lib/api-client';

const GOOGLE_API_KEY = import.meta.env.VITE_GOOGLE_API_KEY || '';

/**
 * Upload file to Google Drive
 * Note: This is a simplified example. For production, you'd typically use
 * the Google Drive API with proper OAuth2 authentication
 */
export const uploadToGoogleDrive = async (file: File, folderId?: string) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    if (folderId) {
      formData.append('folderId', folderId);
    }

    // This would typically be your backend endpoint that handles Google Drive uploads
    const response = await apiClient.post('/api/google/drive/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data;
  } catch (error) {
    console.error('Google Drive upload error:', error);
    throw error;
  }
};

/**
 * Send email via Gmail API
 */
export const sendGmailEmail = async (emailData: {
  to: string;
  subject: string;
  body: string;
  attachments?: File[];
}) => {
  try {
    const formData = new FormData();
    formData.append('to', emailData.to);
    formData.append('subject', emailData.subject);
    formData.append('body', emailData.body);
    
    if (emailData.attachments) {
      emailData.attachments.forEach((file) => {
        formData.append('attachments', file);
      });
    }

    // This would typically be your backend endpoint that handles Gmail API
    const response = await apiClient.post('/api/google/gmail/send', formData);
    return response.data;
  } catch (error) {
    console.error('Gmail send error:', error);
    throw error;
  }
};

/**
 * Create a Google Calendar event
 */
export const createCalendarEvent = async (eventData: {
  summary: string;
  description?: string;
  startTime: string;
  endTime: string;
  attendees?: string[];
}) => {
  try {
    // This would typically be your backend endpoint that handles Google Calendar API
    const response = await apiClient.post('/api/google/calendar/events', eventData);
    return response.data;
  } catch (error) {
    console.error('Calendar event creation error:', error);
    throw error;
  }
};

/**
 * Generic Google API request helper
 */
export const googleApiRequest = async (
  endpoint: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
  data?: any
) => {
  try {
    const response = await apiClient({
      url: `https://www.googleapis.com${endpoint}`,
      method,
      data,
      headers: {
        'Authorization': `Bearer ${GOOGLE_API_KEY}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Google API request error:', error);
    throw error;
  }
};
