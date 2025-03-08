// שמות משתנים עבור טבלת מיקומים
export const TABLE_VARIABLES = {
  LOCATIONS_TABLE: 'locationsDataTable',
  LOCATION_CODE: 'locationCode',
  LOCATION_STREET: 'locationStreet',
  STREET_NUMBER: 'streetNumber',
  CITY_NAME: 'cityName',
  WORK_DAYS: 'workDays',
  CALCULATION_TYPE: 'calculationType',
  PAYMENT_DETAILS: 'paymentDetails',
  ACTIONS: 'actions'
} as const;

// שמות משתנים עבור עמודת ימי עבודה
export const WORKDAYS_VARIABLES = {
  DAYS_COLUMN_HEADER: 'workDaysColumnHeader',
  HOURS_COLUMN_HEADER: 'workHoursColumnHeader',
  SELECTED_DAYS_COLUMN: 'selectedDaysColumn',
  DAY_HOURS_COLUMN: 'dayHoursColumn'
} as const;

// שמות משתנים עבור טבלת ימי עבודה בטופס
export const WORKDAYS_TABLE_VARIABLES = {
  DAY_NAME_COLUMN: 'dayNameColumn',
  DAY_SELECTION_COLUMN: 'daySelectionColumn',
  DAY_HOURS_COLUMN: 'dayHoursInputColumn'
} as const;

// שמות משתנים עבור טופס הוספת/עריכת מיקום
export const FORM_VARIABLES = {
  ADD_LOCATION_FORM: 'addLocationFormContainer',
  STREET_INPUT: 'locationStreetInput',
  STREET_NUMBER_INPUT: 'streetNumberInput',
  CITY_SELECT: 'citySelectInput',
  CALCULATION_TYPE_SELECT: 'calculationTypeSelect',
  WORKDAYS_SELECT: 'workdaysMultiSelect',
  HOURLY_RATE_INPUT: 'hourlyRateInput',
  GLOBAL_AMOUNT_INPUT: 'globalAmountInput',
  SUBMIT_BUTTON: 'submitFormButton',
  CANCEL_BUTTON: 'cancelFormButton'
} as const;

// שמות משתנים עבור טבלת ערים
export const CITIES_TABLE_VARIABLES = {
  TABLE: 'citiesDataTable',
  CITY_ID: 'cityIdColumn',
  CITY_NAME: 'cityNameColumn',
  CITY_CODE: 'cityCodeColumn',
  ACTIONS: 'cityActionsColumn'
} as const;

// שמות משתנים עבור טופס הוספת/עריכת עיר
export const CITY_FORM_VARIABLES = {
  FORM_CONTAINER: 'addCityFormContainer',
  CITY_NAME_INPUT: 'cityNameInput',
  CITY_CODE_INPUT: 'cityCodeInput',
  SUBMIT_BUTTON: 'submitCityButton',
  CANCEL_BUTTON: 'cancelCityButton'
} as const;

// מערך כל שמות המשתנים במערכת
export const ALL_VARIABLE_NAMES = [
  ...Object.values(TABLE_VARIABLES),
  ...Object.values(WORKDAYS_VARIABLES),
  ...Object.values(WORKDAYS_TABLE_VARIABLES),
  ...Object.values(FORM_VARIABLES),
  ...Object.values(CITIES_TABLE_VARIABLES),
  ...Object.values(CITY_FORM_VARIABLES)
] as const; 