import type { Locale } from '../types';

export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const PHONE_REGEX = /^[0-9+\-\s().]{8,20}$/;

export interface FieldErrors {
  [field: string]: string;
}

export function validateRsvpForm(
  values: { fullName: string; email: string; phone: string },
  lang: Locale
): FieldErrors {
  const errors: FieldErrors = {};
  if (values.fullName.trim().length < 2) {
    errors.fullName =
      lang === 'vi' ? 'Họ và tên phải có ít nhất 2 ký tự.' : 'Full name must be at least 2 characters.';
  }
  if (!EMAIL_REGEX.test(values.email.trim())) {
    errors.email =
      lang === 'vi' ? 'Vui lòng nhập địa chỉ email hợp lệ.' : 'Please enter a valid email address.';
  }
  if (!PHONE_REGEX.test(values.phone.trim())) {
    errors.phone =
      lang === 'vi'
        ? 'Số điện thoại cần có 8–20 chữ số hoặc ký tự hợp lệ.'
        : 'Phone number must contain 8–20 valid digits.';
  }
  return errors;
}

export function validateContactForm(
  values: { fullName: string; email: string; phone: string; message: string },
  lang: Locale
): FieldErrors {
  const errors: FieldErrors = {};
  if (values.fullName.trim().length < 2) {
    errors.fullName =
      lang === 'vi' ? 'Họ và tên phải có ít nhất 2 ký tự.' : 'Full name must be at least 2 characters.';
  }
  if (!EMAIL_REGEX.test(values.email.trim())) {
    errors.email =
      lang === 'vi' ? 'Vui lòng nhập địa chỉ email hợp lệ.' : 'Please enter a valid email address.';
  }
  if (values.phone.trim() && !PHONE_REGEX.test(values.phone.trim())) {
    errors.phone =
      lang === 'vi' ? 'Số điện thoại không đúng định dạng.' : 'Phone number format is invalid.';
  }
  if (values.message.trim().length < 10) {
    errors.message =
      lang === 'vi'
        ? 'Nội dung liên hệ cần có ít nhất 10 ký tự.'
        : 'Message must be at least 10 characters.';
  }
  return errors;
}
