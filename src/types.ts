import { ComponentType } from 'react';

// Service interface for mental health services
export interface Service {
    id: string;
    title: string;
    description: string;
    icon: ComponentType<{ className?: string; size?: number }>;
}

export interface Differentiator {
    id: string;
    title: string;
    description: string;
    icon: ComponentType<{ className?: string; size?: number }>;
}

export interface Step {
    number: number;
    title: string;
    description: string;
}

export interface ContactInfo {
    address: string;
    phone: string;
    email: string;
}