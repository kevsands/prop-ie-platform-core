# Unit Management System Implementation Notes

## Current State: Functional Mock Data
The system currently generates realistic mock data and allows real-time status changes within the session.

### What Works Now:
- ✅ 96 units generated with realistic data
- ✅ Status changes work across all views (Grid, List, Icons, Site Plan)
- ✅ Legal pack information updates automatically
- ✅ Buyer information generates correctly
- ✅ All filtering and view modes work

### How to Change Unit Status:
1. Click any unit in Grid, List, or Icon view
2. In the modal, use the dropdown next to status
3. Select: Available, Reserved, or Sold
4. Changes sync across all views immediately

### To Make Data Persistent:
Replace the mock data generation with real database calls:

```typescript
// Replace this:
React.useEffect(() => {
  const generatedUnits = generateAllUnits();
  setUnits(generatedUnits);
}, []);

// With this:
React.useEffect(() => {
  fetchUnitsFromDatabase();
}, []);

const fetchUnitsFromDatabase = async () => {
  const response = await fetch('/api/projects/fitzgerald-gardens/units');
  const units = await response.json();
  setUnits(units);
};

const updateUnitStatus = async (unitId, newStatus) => {
  // Update database
  await fetch(`/api/units/${unitId}`, {
    method: 'PATCH',
    body: JSON.stringify({ status: newStatus }),
    headers: { 'Content-Type': 'application/json' }
  });
  
  // Update local state
  setUnits(prevUnits => 
    prevUnits.map(unit => 
      unit.id === unitId ? { ...unit, status: newStatus } : unit
    )
  );
};
```

### Database Schema Needed:
- units table with: id, number, type, status, price, beds, baths, sqft, building, floor, x, y
- buyers table with: id, unit_id, name, email, phone, solicitor
- legal_packs table with: id, unit_id, solicitor_pack, contract_signed, deposit_paid, etc.

### API Endpoints to Create:
- GET /api/projects/[id]/units - Fetch all units
- PATCH /api/units/[id] - Update unit status
- POST /api/units/[id]/buyer - Add buyer information
- GET /api/units/[id]/legal-pack - Get legal documents