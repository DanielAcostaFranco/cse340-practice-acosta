// Faculty data object
const faculty = {
  'brother-jack': {
    name: 'Brother Jack',
    office: 'STC 392',
    phone: '208-496-1234',
    email: 'jackb@byui.edu',
    department: 'Computer Science',
    title: 'Associate Professor'
  },
  'sister-enkey': {
    name: 'Sister Enkey',
    office: 'STC 394',
    phone: '208-496-2345',
    email: 'enkeys@byui.edu',
    department: 'Computer Science',
    title: 'Assistant Professor'
  },
  'brother-keers': {
    name: 'Brother Keers',
    office: 'STC 390',
    phone: '208-496-3456',
    email: 'keersb@byui.edu',
    department: 'Computer Science',
    title: 'Professor'
  },
  'sister-anderson': {
    name: 'Sister Anderson',
    office: 'MC 301',
    phone: '208-496-4567',
    email: 'andersons@byui.edu',
    department: 'Mathematics',
    title: 'Professor'
  },
  'brother-miller': {
    name: 'Brother Miller',
    office: 'MC 305',
    phone: '208-496-5678',
    email: 'millerb@byui.edu',
    department: 'Mathematics',
    title: 'Associate Professor'
  },
  'brother-thompson': {
    name: 'Brother Thompson',
    office: 'MC 307',
    phone: '208-496-6789',
    email: 'thompsonb@byui.edu',
    department: 'Mathematics',
    title: 'Assistant Professor'
  },
  'brother-davis': {
    name: 'Brother Davis',
    office: 'GEB 205',
    phone: '208-496-7890',
    email: 'davisb@byui.edu',
    department: 'English',
    title: 'Professor'
  },
  'brother-wilson': {
    name: 'Brother Wilson',
    office: 'GEB 301',
    phone: '208-496-8901',
    email: 'wilsonb@byui.edu',
    department: 'History',
    title: 'Associate Professor'
  },
  'sister-roberts': {
    name: 'Sister Roberts',
    office: 'GEB 305',
    phone: '208-496-9012',
    email: 'robertss@byui.edu',
    department: 'History',
    title: 'Assistant Professor'
  }
};

/**
 * Return ALL faculty as an ARRAY including each member's id
 * This is useful for listing and sorting
 */
const getAllFaculty = () => {
  // Convert object -> array and keep the id
  return Object.entries(faculty).map(([id, member]) => ({
    id,
    ...member
  }));
};

/**
 * Look up faculty member by ID, return null if not found
 */
const getFacultyById = (facultyId) => {
  return faculty[facultyId] || null;
};

/**
 * Return a sorted ARRAY of faculty based on 'name', 'department', or 'title'
 * If sortBy is invalid, default to 'department'
 */
const getSortedFaculty = (sortBy) => {
  // Validate sortBy parameter
  const validSorts = ['name', 'department', 'title'];
  const key = validSorts.includes(sortBy) ? sortBy : 'department';

  // Get all faculty as array (with ids)
  const facultyArray = getAllFaculty();

  // Sort the array by the chosen property
  facultyArray.sort((a, b) => {                  // here i put the error to show development mode 
    // Use localeCompare for safer string sorting
    return a[key].localeCompare(b[key]);
  });

  // Return the sorted array
  return facultyArray;
};

export { getAllFaculty, getFacultyById, getSortedFaculty };
