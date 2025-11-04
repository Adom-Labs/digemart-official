export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^(\+?234|0)?[0-9]{10,11}$/;
  return phoneRegex.test(phone.replace(/[\s-]/g, ""));
};

export const formatPhoneNumber = (phone: string): string => {
  const cleaned = phone.replace(/[\s-]/g, "");
  if (cleaned.startsWith("+234")) return cleaned;
  if (cleaned.startsWith("0")) return "+234" + cleaned.substring(1);
  return "+234" + cleaned;
};

export const formatTime = (time: string): string => {
  // Convert 24h to 12h format
  const [hours, minutes] = time.split(":");
  const hour = parseInt(hours);
  const ampm = hour >= 12 ? "PM" : "AM";
  const hour12 = hour % 12 || 12;
  return `${hour12}:${minutes} ${ampm}`;
};

export const generateSubdomain = (storeName: string): string => {
  return storeName
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
};

export const getInputPlaceholder = (
  step: string,
  disabled: boolean
): string => {
  if (disabled) return "Please select an option above...";

  switch (step) {
    case "store-name":
      return "Enter your store name...";
    case "store-description":
      return "Describe what you offer...";
    case "edit-subdomain":
      return "your-store-name";
    case "hero-headline":
      return "Welcome to our amazing store!";
    case "hero-tagline":
      return "Quality products at great prices";
    case "store-email":
      return "your@email.com";
    case "store-phone":
      return "08012345678";
    default:
      return "Type your answer...";
  }
};
