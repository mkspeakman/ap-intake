import apiClient from '../lib/api-client';
import type { QuoteRequestSubmission, QuoteRequestResponse, ApiResponse } from '../types/database.types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

/**
 * Generate a unique quote number
 */
export const generateQuoteNumber = (): string => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `QR-${year}${month}${day}-${random}`;
};

/**
 * Submit quote request to database via API
 */
export const submitQuoteRequest = async (
  formData: QuoteRequestSubmission
): Promise<ApiResponse<QuoteRequestResponse>> => {
  try {
    const quoteNumber = generateQuoteNumber();
    
    const payload = {
      quote_number: quoteNumber,
      company_name: formData.companyName,
      contact_name: formData.contactName,
      email: formData.email,
      phone: formData.phone,
      project_name: formData.projectName,
      description: formData.description,
      quantity: formData.quantity,
      lead_time: formData.leadTime,
      part_notes: formData.partNotes,
      materials: formData.materials,
      finishes: formData.finishes,
      certifications: formData.certifications,
      files: formData.files,
    };

    const response = await apiClient.post<ApiResponse<QuoteRequestResponse>>(
      `${API_BASE_URL}/quote-requests`,
      payload
    );

    return response.data;
  } catch (error) {
    console.error('Error submitting quote request:', error);
    throw error;
  }
};

/**
 * Get all quote requests (with optional filters)
 */
export const getQuoteRequests = async (filters?: {
  status?: string;
  company_name?: string;
  from_date?: string;
  to_date?: string;
}) => {
  try {
    const response = await apiClient.get(`${API_BASE_URL}/quote-requests`, {
      params: filters,
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching quote requests:', error);
    throw error;
  }
};

/**
 * Get a single quote request by ID or quote number
 */
export const getQuoteRequest = async (idOrQuoteNumber: string | number) => {
  try {
    const response = await apiClient.get(
      `${API_BASE_URL}/quote-requests/${idOrQuoteNumber}`
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching quote request:', error);
    throw error;
  }
};

/**
 * Update quote request status
 */
export const updateQuoteStatus = async (
  id: number,
  status: string
) => {
  try {
    const response = await apiClient.patch(
      `${API_BASE_URL}/quote-requests/${id}/status`,
      { status }
    );
    return response.data;
  } catch (error) {
    console.error('Error updating quote status:', error);
    throw error;
  }
};

/**
 * Get analytics/statistics for AI analysis
 */
export const getQuoteAnalytics = async () => {
  try {
    const response = await apiClient.get(`${API_BASE_URL}/quote-requests/analytics`);
    return response.data;
  } catch (error) {
    console.error('Error fetching analytics:', error);
    throw error;
  }
};
