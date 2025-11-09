import { useState } from 'react';
import { supabase } from '../lib/supabase';

export interface ContactFormData {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  message: string;
  status?: 'new' | 'read' | 'responded' | 'archived';
  createdAt?: string;
  updatedAt?: string;
}

export interface ContactFormState {
  submissions: ContactFormData[];
  loading: boolean;
  error: string | null;
  submitting: boolean;
}

export const useContactForm = () => {
  const [state, setState] = useState<ContactFormState>({
    submissions: [],
    loading: false,
    error: null,
    submitting: false
  });

  // CREATE - Submit new contact form
  const createSubmission = async (formData: Omit<ContactFormData, 'id' | 'createdAt' | 'updatedAt'>): Promise<ContactFormData | null> => {
    setState(prev => ({ ...prev, submitting: true, error: null }));

    try {
      console.log('📧 useContactForm: Creating submission with data:', formData);

      // Use direct Supabase insert (RLS is disabled for contact_submissions)
      const { data, error } = await supabase
        .from('contact_submissions')
        .insert([{
          first_name: formData.firstName,
          last_name: formData.lastName,
          email: formData.email,
          message: formData.message,
          status: 'new'
        }])
        .select()
        .single();

      console.log('📧 useContactForm: Supabase response:', { data, error });

      if (error) {
        console.error('❌ useContactForm: Supabase error:', error);
        throw new Error(error.message || 'Failed to submit form');
      }

      if (!data) {
        throw new Error('No data returned from database');
      }

      // Map database response to ContactFormData
      const newSubmission: ContactFormData = {
        id: data.id,
        firstName: data.first_name,
        lastName: data.last_name,
        email: data.email,
        message: data.message,
        status: data.status,
        createdAt: data.created_at,
        updatedAt: data.updated_at
      };

      console.log('✅ useContactForm: Successfully created submission:', newSubmission);

      setState(prev => ({
        ...prev,
        submissions: [newSubmission, ...prev.submissions],
        submitting: false
      }));

      return newSubmission;
    } catch (error) {
      console.error('💥 useContactForm: Exception in createSubmission:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to submit form';
      setState(prev => ({
        ...prev,
        error: errorMessage,
        submitting: false
      }));
      return null;
    }
  };

  // READ - Get all contact submissions (admin only)
  const getSubmissions = async (filters?: { status?: string; limit?: number }): Promise<ContactFormData[]> => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      console.log('📧 useContactForm: Fetching submissions from database...');

      let query = supabase
        .from('contact_submissions')
        .select('*')
        .order('created_at', { ascending: false });

      if (filters?.status) {
        query = query.eq('status', filters.status);
      }

      if (filters?.limit) {
        query = query.limit(filters.limit);
      }

      const { data, error } = await query;

      if (error) {
        console.error('❌ useContactForm: Database error:', error);

        // Check if it's a table not found error
        if (error.message.includes('relation "contact_submissions" does not exist')) {
          throw new Error('Contact submissions table not found. Please run the database migration first.');
        }

        throw error;
      }

      console.log('✅ useContactForm: Successfully fetched', data?.length || 0, 'submissions');

      const submissions: ContactFormData[] = (data || []).map(item => ({
        id: item.id,
        firstName: item.first_name,
        lastName: item.last_name,
        email: item.email,
        message: item.message,
        status: item.status,
        createdAt: item.created_at,
        updatedAt: item.updated_at
      }));

      setState(prev => ({
        ...prev,
        submissions,
        loading: false
      }));

      return submissions;
    } catch (error) {
      console.error('💥 useContactForm: Exception in getSubmissions:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch submissions';
      setState(prev => ({
        ...prev,
        error: errorMessage,
        loading: false,
        submissions: [] // Ensure we have an empty array
      }));
      return [];
    }
  };

  // READ - Get single submission by ID
  const getSubmissionById = async (id: string): Promise<ContactFormData | null> => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const { data, error } = await supabase
        .from('contact_submissions')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        throw error;
      }

      const submission: ContactFormData = {
        id: data.id,
        firstName: data.first_name,
        lastName: data.last_name,
        email: data.email,
        message: data.message,
        status: data.status,
        createdAt: data.created_at,
        updatedAt: data.updated_at
      };

      setState(prev => ({ ...prev, loading: false }));
      return submission;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch submission';
      setState(prev => ({
        ...prev,
        error: errorMessage,
        loading: false
      }));
      return null;
    }
  };

  // UPDATE - Update submission status (admin only)
  const updateSubmissionStatus = async (id: string, status: ContactFormData['status']): Promise<boolean> => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const { error } = await supabase
        .from('contact_submissions')
        .update({
          status,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) {
        throw error;
      }

      // Update local state
      setState(prev => ({
        ...prev,
        submissions: prev.submissions.map(sub =>
          sub.id === id ? { ...sub, status, updatedAt: new Date().toISOString() } : sub
        ),
        loading: false
      }));

      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update submission';
      setState(prev => ({
        ...prev,
        error: errorMessage,
        loading: false
      }));
      return false;
    }
  };

  // DELETE - Delete submission (admin only)
  const deleteSubmission = async (id: string): Promise<boolean> => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const { error } = await supabase
        .from('contact_submissions')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }

      // Update local state
      setState(prev => ({
        ...prev,
        submissions: prev.submissions.filter(sub => sub.id !== id),
        loading: false
      }));

      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete submission';
      setState(prev => ({
        ...prev,
        error: errorMessage,
        loading: false
      }));
      return false;
    }
  };

  // Utility function to clear errors
  const clearError = () => {
    setState(prev => ({ ...prev, error: null }));
  };

  // Utility function to reset form state
  const resetState = () => {
    setState({
      submissions: [],
      loading: false,
      error: null,
      submitting: false
    });
  };

  return {
    ...state,
    createSubmission,
    getSubmissions,
    getSubmissionById,
    updateSubmissionStatus,
    deleteSubmission,
    clearError,
    resetState
  };
};
