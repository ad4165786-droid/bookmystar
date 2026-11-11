/**
 * Common formatting utilities for BookMyStar
 */

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatCompactNumber = (number: number): string => {
  return new Intl.NumberFormat('en-IN', {
    notation: 'compact',
    compactDisplay: 'short',
  }).format(number);
};

export const formatDate = (dateStr: string): string => {
  if (!dateStr) return '';
  return dateStr;
};

export const formatDuration = (minutes: number): string => {
  if (minutes < 60) return `${minutes} mins`;
  const hrs = Math.floor(minutes / 60);
  const remaining = minutes % 60;
  return remaining > 0 ? `${hrs}h ${remaining}m` : `${hrs} hrs`;
};
