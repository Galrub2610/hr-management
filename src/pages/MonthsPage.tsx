import React, { useState } from 'react';
import styles from './MonthsPage.module.css';

interface DayCount {
  name: string;
  count: number;
}

interface MonthData {
  monthYear: string;
  days: DayCount[];
  weekdaysTotal: number;
  saturdaysTotal: number;
  monthTotal: number;
}

const DAYS = [
  'ראשון',
  'שני',
  'שלישי',
  'רביעי',
  'חמישי',
  'שישי',
  'שבת'
];

const calculateDaysInMonth = (year: number, month: number): DayCount[] => {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const counts = new Array(7).fill(0);
  
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day);
    const dayOfWeek = date.getDay();
    counts[dayOfWeek]++;
  }
  
  return DAYS.map((name, index) => ({
    name,
    count: counts[index]
  }));
};

const generateMonthsData = (year: number): MonthData[] => {
  const months = [];
  
  for (let month = 0; month < 12; month++) {
    const monthStr = (month + 1).toString().padStart(2, '0');
    const days = calculateDaysInMonth(year, month);
    
    const weekdaysTotal = days
      .filter(day => day.name !== 'שבת')
      .reduce((sum, day) => sum + day.count, 0);
    
    const saturdaysTotal = days.find(day => day.name === 'שבת')?.count || 0;
    const monthTotal = days.reduce((sum, day) => sum + day.count, 0);
    
    months.push({
      monthYear: `${monthStr}/${year}`,
      days,
      weekdaysTotal,
      saturdaysTotal,
      monthTotal
    });
  }
  
  return months;
};

const MonthsPage: React.FC = () => {
  const [years, setYears] = useState<number[]>([2025]);
  
  const handleAddYear = () => {
    const nextYear = years[years.length - 1] + 1;
    setYears([...years, nextYear]);
  };
  
  const allMonthsData = years.flatMap(year => generateMonthsData(year));

  return (
    <div className="container mx-auto p-4">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold mb-4">
          חודשי השנה וכמות ימים (monthsDataTable)
        </h1>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th rowSpan={2} className="px-6 py-3 text-right font-medium text-gray-500">
                  חודש (monthColumn)
                </th>
                <th colSpan={2} className="px-6 py-3 text-center font-medium text-gray-500">
                  מס׳ הופעת הימים (daysAppearance)
                </th>
                <th rowSpan={2} className="px-6 py-3 text-right font-medium text-gray-500">
                  סיכומים (monthSummary)
                </th>
              </tr>
              <tr>
                <th className="px-6 py-3 text-right font-medium text-gray-500">יום (dayName)</th>
                <th className="px-6 py-3 text-right font-medium text-gray-500">כמות (dayCount)</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {allMonthsData.map((monthData) => (
                <React.Fragment key={monthData.monthYear}>
                  {monthData.days.map((day, dayIndex) => (
                    <tr key={`${monthData.monthYear}-${day.name}`}>
                      {dayIndex === 0 && (
                        <td rowSpan={7} className="px-6 py-4 whitespace-nowrap">
                          {monthData.monthYear}
                        </td>
                      )}
                      <td className="px-6 py-4 whitespace-nowrap">{day.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">{day.count}</td>
                      {dayIndex === 0 && (
                        <td rowSpan={7} className="px-6 py-4">
                          <div className="space-y-2">
                            <p>סה״כ ימי אמצע שבוע (weekdaysTotal): {monthData.weekdaysTotal}</p>
                            <p>כמות ימי שבת (saturdaysTotal): {monthData.saturdaysTotal}</p>
                            <p>סה״כ כמות הימים בחודש (monthTotalDays): {monthData.monthTotal}</p>
                          </div>
                        </td>
                      )}
                    </tr>
                  ))}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="mt-6 text-center">
          <button
            onClick={handleAddYear}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            הוסף שנה חדשה
          </button>
        </div>
      </div>
    </div>
  );
};

export default MonthsPage; 