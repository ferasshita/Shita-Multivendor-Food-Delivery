import validator from 'validator';

export const validateEmail = (email: string): boolean => {
  return validator.isEmail(email);
};

export const validatePhone = (phone: string): boolean => {
  // Basic phone validation - adjust regex based on your requirements
  return validator.isMobilePhone(phone, 'any');
};

export const validatePassword = (password: string): { isValid: boolean; message?: string } => {
  if (password.length < 6) {
    return { isValid: false, message: 'Password must be at least 6 characters long' };
  }
  return { isValid: true };
};

export const sanitizeInput = (input: string): string => {
  return validator.escape(input.trim());
};

export const validateOrderId = (orderId: string): boolean => {
  // Validate order ID format (PREFIX-TIMESTAMP-RANDOM)
  return /^[A-Z0-9]+-[A-Z0-9]+-[A-Z0-9]+$/.test(orderId);
};

export const validateCoordinates = (latitude: number, longitude: number): boolean => {
  return (
    validator.isLatLong(`${latitude},${longitude}`) &&
    latitude >= -90 &&
    latitude <= 90 &&
    longitude >= -180 &&
    longitude <= 180
  );
};
