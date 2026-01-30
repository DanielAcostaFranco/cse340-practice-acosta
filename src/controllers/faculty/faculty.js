// Import model functions
import { getFacultyById, getSortedFaculty } from '../../models/faculty/faculty.js';

/**
 * Route handler for the faculty list page
 * URL: /faculty
 * This page displays ALL faculty members
 * Sorting is handled here using query parameters
 */
const facultyListPage = (req, res) => {

  // Get sort option from query string (name, title, department)
  // Default sort is by name
  const sortBy = req.query.sort || 'name';

  // Sort faculty list BEFORE rendering
  const sortedFaculty = getSortedFaculty(sortBy);

  // Render faculty list page
  res.render('faculty/list', {
    title: 'Faculty Page',
    faculty: sortedFaculty,
    currentSort: sortBy
  });
};

/**
 * Route handler for individual faculty detail page
 * URL: /faculty/:facultyId
 * This page displays ONE faculty member
 * NO sorting is done here
 */
const facultyDetailPage = (req, res, next) => {

  // Get faculty id from route params
  const facultyId = req.params.facultyId;

  // Get faculty member by id
  const faculty = getFacultyById(facultyId);

  // If faculty does not exist, trigger 404 error
  if (!faculty) {
    const err = new Error(`Faculty member: ${facultyId} not found.`);
    err.status = 404;
    return next(err);
  }

  // Render faculty detail page
  res.render('faculty/detail', {
    title: faculty.name,
    faculty,

    // Display labels (used in EJS)
    name: `Name: ${faculty.name}`,
    office: `Office: ${faculty.office}`,
    phone: `Phone: ${faculty.phone}`,
    email: `Email: ${faculty.email}`,
    department: `Department: ${faculty.department}`,
    titleLabel: `Title: ${faculty.title}` // avoid overwriting page title
  });
};

// Export route handlers
export { facultyListPage, facultyDetailPage };
