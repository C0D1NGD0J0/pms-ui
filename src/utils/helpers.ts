export const validatePhoneNumber = (phoneNumber: string): boolean => {
  const phoneRegex =
    /^(?:(?:\+|00)([1-9]\d{0,2}))?[ .-]?(?:\(([0-9]{1,4})\)|([0-9]{1,4}))[ .-]?([0-9]{1,4})(?:[ .-]?([0-9]{1,4}))*$/;
  const isValidFormat = phoneRegex.test(phoneNumber);

  if (!isValidFormat) return false;

  const digitCount = phoneNumber.replace(/\D/g, "").length;
  return digitCount >= 7 && digitCount <= 15;
};
