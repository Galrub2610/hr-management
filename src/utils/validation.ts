export function validateCompany(company: any): string | null {
  if (!company || typeof company !== "object") {
    return "❌ נתוני החברה אינם תקינים.";
  }
  if (!company.code || !/^\d{2}$/.test(company.code.trim())) {
    return "❌ קוד החברה חייב להיות בן 2 ספרות.";
  }
  if (!company.name || company.name.trim().length < 2) {
    return "❌ שם החברה חייב להיות לפחות 2 תווים.";
  }
  return null;
}

export function validateLocation(location: any): string | null {
  if (!location || typeof location !== "object") {
    return "❌ נתוני המיקום אינם תקינים.";
  }
  if (!location.code || !/^\d{5}$/.test(location.code.trim())) {
    return "❌ קוד המיקום חייב להיות בן 5 ספרות.";
  }
  if (!location.address || location.address.trim().length < 5) {
    return "❌ כתובת חייבת להיות לפחות 5 תווים.";
  }
  if (typeof location.price !== "number" || location.price <= 0) {
    return "❌ המחיר חייב להיות מספר חיובי.";
  }
  if (!location.companyId || typeof location.companyId !== "string") {
    return "❌ לכל מיקום חייב להיות מזהה חברה חוקי.";
  }
  return null;
}

export function validateEmployee(employee: any): string | null {
  if (!employee || typeof employee !== "object") {
    return "❌ נתוני העובד אינם תקינים.";
  }
  if (!employee.code || !/^\d{3}$/.test(employee.code.trim())) {
    return "❌ קוד העובד חייב להיות בן 3 ספרות.";
  }
  if (!employee.name || employee.name.trim().length < 2) {
    return "❌ שם העובד חייב להיות לפחות 2 תווים.";
  }
  if (!employee.locationId || typeof employee.locationId !== "string") {
    return "❌ לכל עובד חייב להיות מזהה מיקום חוקי.";
  }
  if (!employee.companyId || typeof employee.companyId !== "string") {
    return "❌ לכל עובד חייב להיות מזהה חברה חוקי.";
  }
  return null;
}
