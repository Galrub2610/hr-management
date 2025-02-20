import { useState, useEffect } from 'react';
import { getActivityLogs, clearActivityLogs, saveActivityLogs } from '../services/ActivityLogService';

interface ActivityLog {
  id: string;
  user: string;
  action: string;
  entity: string;
  entityId: string;
  timestamp: string;
}

// ✅ פונקציה לייצוא CSV
const exportToCSV = (logs: ActivityLog[]) => {
  const csvContent = [
    ["User", "Action", "Entity", "Entity ID", "Timestamp"],
    ...logs.map(log => [
      log.user,
      log.action,
      log.entity,
      log.entityId,
      log.timestamp
    ])
  ]
    .map(e => e.join(","))
    .join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", "activity_logs.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// ✅ פונקציה לייבוא CSV עם הודעות שגיאה ושמירה על לוגים קודמים
const importFromCSV = (file: File, setLogs: (logs: ActivityLog[]) => void) => {
  const reader = new FileReader();
  reader.onload = (e) => {
    if (!e.target?.result) return;
    
    try {
      const text = e.target.result.toString();
      const rows = text.split("\n").slice(1); // דילוג על כותרות
      const importedLogs: ActivityLog[] = rows
        .filter(row => row.trim() !== "" && row.split(",").length === 5) // ✅ סינון שורות לא תקינות
        .map(row => {
          const [user, action, entity, entityId, timestamp] = row.split(",");
          return {
            id: crypto.randomUUID(),
            user: user.trim(),
            action: action.trim(),
            entity: entity.trim(),
            entityId: entityId.trim(),
            timestamp: timestamp.trim(),
          };
        });

      if (importedLogs.length === 0) {
        alert("❌ No valid logs found in the CSV file.");
        return;
      }

      const existingLogs = getActivityLogs(); // ✅ שמירה על הלוגים הקיימים
      const updatedLogs = [...importedLogs, ...existingLogs]; 
      saveActivityLogs(updatedLogs);
      setLogs(updatedLogs);
      alert(`✅ Successfully imported ${importedLogs.length} logs.`);
    } catch (error) {
      console.error("❌ CSV Import failed:", error);
      alert("❌ Failed to import CSV. Please check the file format.");
    }
  };
  reader.readAsText(file);
};

export default function ActivityLogPage() {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [importFile, setImportFile] = useState<File | null>(null);

  useEffect(() => {
    setLogs(getActivityLogs());
  }, []);

  const handleClearLogs = () => {
    if (confirm('Are you sure you want to clear all activity logs?')) {
      clearActivityLogs();
      setLogs([]);
    }
  };

  const handleImport = () => {
    if (importFile) {
      importFromCSV(importFile, setLogs);
      setImportFile(null); // מאפס את הקובץ לאחר הייבוא
    } else {
      alert("❌ Please select a file first.");
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Activity Log</h1>

      {/* 🟢 כפתורים חדשים בעיצוב אחיד */}
      <div className="flex space-x-4 mb-6">
        {/* כפתור Clear All Logs */}
        <button
          className="bg-red-500 text-white px-4 py-2 rounded shadow-md hover:bg-red-600 transition"
          onClick={handleClearLogs}
        >
          Clear All Logs
        </button>

        {/* כפתור Export to CSV */}
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded shadow-md hover:bg-blue-600 transition"
          onClick={() => exportToCSV(logs)}
        >
          Export to CSV
        </button>

        {/* ✅ כפתור Choose File מעוצב */}
        <input
          type="file"
          accept=".csv"
          className="hidden"
          id="csvInput"
          onChange={(e) => {
            if (e.target.files?.length) {
              setImportFile(e.target.files[0]);
            }
          }}
        />

        <label
          htmlFor="csvInput"
          className="bg-gray-500 text-white px-4 py-2 rounded shadow-md hover:bg-gray-600 transition cursor-pointer"
        >
          Choose File
        </label>

        {/* ✅ כפתור Import File עם אותו עיצוב */}
        <button
          className={`px-4 py-2 rounded shadow-md transition ${
            importFile ? 'bg-green-500 hover:bg-green-600 text-white' : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
          onClick={handleImport}
          disabled={!importFile}
        >
          Import File
        </button>
      </div>

      {/* 🟡 טבלת לוגים */}
      <table className="w-full border-collapse border border-gray-200">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2">User</th>
            <th className="border p-2">Action</th>
            <th className="border p-2">Entity</th>
            <th className="border p-2">Entity ID</th>
            <th className="border p-2">Timestamp</th>
          </tr>
        </thead>
        <tbody>
          {logs.length === 0 ? (
            <tr>
              <td colSpan={5} className="text-center p-4">No activity logs found.</td>
            </tr>
          ) : (
            logs.map(log => (
              <tr key={log.id} className="text-center">
                <td className="border p-2">{log.user}</td>
                <td className="border p-2">{log.action}</td>
                <td className="border p-2">{log.entity}</td>
                <td className="border p-2">{log.entityId}</td>
                <td className="border p-2">{log.timestamp}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
