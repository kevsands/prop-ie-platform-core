// Finance API endpoints index

// Main financial dashboard data endpoint
export { GET, POST } from './route';

// Financial projections endpoint
export { GET as getProjections, POST as updateProjections } from './projections/route';

// Budget vs actual endpoint
export { GET as getBudgetVsActual, POST as updateBudgetItem } from './budget-vs-actual/route';