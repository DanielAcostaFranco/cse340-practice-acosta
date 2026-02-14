// Import model functions
import { getFacultyById, getFacultyBySlug, getSortedFaculty } from '../../models/faculty/faculty.js';

/**
 * Route handler for the faculty list page
 * URL: /faculty
 * This page displays ALL faculty members
 * Sorting is handled here using query parameters
 */
const facultyListPage = async (req, res) => {

  // Get sort option from query string (name, title, department)
  // Default sort is by name
  const sortBy = req.query.sort || 'name';

  // Sort faculty list BEFORE rendering
  const sortedFaculty = await getSortedFaculty(sortBy);

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
const facultyDetailPage = async (req, res, next) => {
  try {
    // Get faculty id/slug from route params
    const facultyParam = req.params.facultyId;

    // Detect whether param is a numeric id or a textual slug
    const isNumericId = /^\d+$/.test(facultyParam);

    // Fetch the faculty member using the appropriate helper
    const faculty = isNumericId
      ? await getFacultyById(Number(facultyParam))
      : await getFacultyBySlug(facultyParam);

    // If faculty does not exist, trigger 404 error
    if (!faculty || !faculty.id) {
      const err = new Error(`Faculty member: ${facultyParam} not found.`);
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
  } catch (error) {
    // Pass any unexpected errors to the global error handler
    return next(error);
  }
};

// Export route handlers
export { facultyListPage, facultyDetailPage };
