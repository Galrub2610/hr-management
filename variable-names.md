# שמות משתנים במערכת

## דף ניהול עובדים (EmployeeManagement)

### טבלה ראשית
שם נוכחי: `employeesTable`
שם מוצע: `employeesManagementTable`

#### עמודות הטבלה
1. שם נוכחי: `code` | שם מוצע: `employeeCode` - קוד עובד
2. שם נוכחי: `name` | שם מוצע: `fullName` - שם מלא
3. שם נוכחי: `phone` | שם מוצע: `phoneNumber` - מספר טלפון
4. שם נוכחי: `permit` | שם מוצע: `workPermit` - אישור עבודה
5. שם נוכחי: `city` | שם מוצע: `city` - עיר מגורים

### טופס עובד
#### שדות קלט
- שם נוכחי: `nameInput` | שם מוצע: `employeeNameInput` - שדה שם מלא
- שם נוכחי: `phoneInput` | שם מוצע: `employeePhoneInput` - שדה טלפון
- שם נוכחי: `permitSelect` | שם מוצע: `employeeWorkPermitInput` - שדה אישור עבודה
- שם נוכחי: `citySelect` | שם מוצע: `employeeCityInput` - שדה עיר מגורים

#### כפתורים
- שם נוכחי: `addBtn` | שם מוצע: `addNewEmployeeButton` - כפתור הוספת עובד חדש
- שם נוכחי: `saveBtn` | שם מוצע: `saveEmployeeButton` - כפתור שמירת עובד
- שם נוכחי: `cancelBtn` | שם מוצע: `cancelButton` - כפתור ביטול

## דף מיקומים (LocationsPage)
### כותרות
- שם נוכחי: `locationsManagementTable` - כותרת טבלת ניהול מיקומים

### טבלה ראשית
#### עמודות הטבלה
1. שם נוכחי: `locationCode` - קוד מיקום
2. שם נוכחי: `locationAddress` - כתובת
3. שם נוכחי: `locationCity` - עיר
4. שם נוכחי: `managementCompany` - חברת ניהול
5. שם נוכחי: `calculationType` - סוג חישוב
6. שם נוכחי: `workDays` - ימי עבודה
7. שם נוכחי: `actions` - פעולות

## דף חברות (CompanyPage)
### כותרות
- שם נוכחי: `companiesManagementTableTitle` - כותרת טבלת ניהול חברות

### טבלה ראשית
שם נוכחי: `companiesTable` | שם מוצע: `companiesManagementTable`

#### עמודות הטבלה
1. שם נוכחי: `id` | שם מוצע: `companyId` - מזהה חברה
2. שם נוכחי: `name` | שם מוצע: `companyName` - שם החברה
3. שם נוכחי: `address` | שם מוצע: `companyAddress` - כתובת
4. שם נוכחי: `phone` | שם מוצע: `companyPhone` - טלפון
5. שם נוכחי: `email` | שם מוצע: `companyEmail` - דואר אלקטרוני
6. שם נוכחי: `status` | שם מוצע: `companyStatus` - סטטוס

## דף ערים (CitiesManagement)
### טבלה ראשית
שם נוכחי: `citiesTable` | שם מוצע: `citiesManagementTable`

#### עמודות הטבלה
1. שם נוכחי: `id` | שם מוצע: `cityId` - מזהה עיר
2. שם נוכחי: `name` | שם מוצע: `cityName` - שם העיר
3. שם נוכחי: `region` | שם מוצע: `cityRegion` - אזור
4. שם נוכחי: `status` | שם מוצע: `cityStatus` - סטטוס

הערות: 
1. השמות הנוכחיים הם השמות שנמצאים כרגע בקוד
2. השמות המוצעים הם שמות שמומלץ לשנות אליהם לצורך אחידות ובהירות
3. המטרה בשמות המוצעים היא ליצור אחידות בין כל הדפים ולהבהיר את המשמעות של כל שדה 

## דף הבית - DashboardPage

### טבלת ניהול הכנסות חודשית
- שם הטבלה: monthlyIncomeManagementTable
- עמודות:
  - קוד מיקום: locationCode
  - חברת ניהול: managementCompany
  - כתובת: locationAddress
  - ימי עבודה: workDays
  - פרטי תשלום: paymentDetails
  - סכום לגבייה: collectionAmount
  - פעולות: actions 

# שמות משתנים בפרויקט

## טבלאות

### טבלת incomeSection (טבלת הכנסות)
- `managementCompanyCode` - קוד חברת ניהול
- `managementCompanyName` - שם חברת ניהול
- `locationAddress` - כתובת המיקום
- `workDays` - ימי עבודה
- `paymentDetails` - פרטי תשלום
- `collectionAmount` - סכום לגבייה
- `actions` - פעולות 

## טבלת ניהול הכנסות חודשית
- `monthlyIncomeManagementTable` - טבלת ניהול הכנסות חודשית
- `managementCompanyColumn` - עמודת חברת הניהול
- `locationAddressColumn` - עמודת כתובת המיקום
- `workDaysColumn` - עמודת ימי עבודה
- `paymentDetailsColumn` - עמודת פרטי תשלום
- `collectionAmountColumn` - עמודת סכום לגבייה
- `actionsColumn` - עמודת פעולות
- `summaryRow` - שורת סיכום
- `totalHoursCell` - תא סה"כ שעות
- `calculationSummaryCell` - תא סיכום חישוב
- `totalAmountCell` - תא סה"כ סכום
- `totalLocationsCell` - תא סה"כ מיקומים 