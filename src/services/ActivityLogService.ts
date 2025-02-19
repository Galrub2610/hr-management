// src/services/ActivityLogService.ts

interface ActivityLog {
  id: string;
  user: string;
  action: string;
  entity: string;
  entityId: string;
  timestamp: string;
}

// ✅ קבלת לוגים
export const getActivityLogs = (): ActivityLog[] => {
  const logs = localStorage.getItem('activityLogs');
  return logs ? JSON.parse(logs) : [];
};

// ✅ הוספת לוג חדש
export const addActivityLog = (
  user: string,
  action: string,
  entity: string,
  entityId: string
) => {
  const newLog: ActivityLog = {
    id: crypto.randomUUID(),
    user,
    action,
    entity,
    entityId,
    timestamp: new Date().toLocaleString(),
  };

  const logs = getActivityLogs();
  logs.unshift(newLog); // מוסיף לוג חדש לראש הרשימה
  localStorage.setItem('activityLogs', JSON.stringify(logs));
};

// ✅ שמירת לוגים - פונקציה חדשה שנדרשה
export const saveActivityLogs = (logs: ActivityLog[]): void => {
  localStorage.setItem('activityLogs', JSON.stringify(logs));
};

// ✅ ניקוי כל הלוגים
export const clearActivityLogs = () => {
  localStorage.removeItem('activityLogs');
};
