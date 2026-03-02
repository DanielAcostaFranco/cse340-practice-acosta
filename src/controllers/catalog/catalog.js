import { getAllCourses, getCourseById, getCourseBySlug } from '../../models/catalog/courses.js';
import { getSectionsByCourseId, getSectionsByCourseSlug } from '../../models/catalog/catalog.js';

// Route handler for the course catalog list page
const catalogPage = async (req, res) => {
    // Model functions are async, so we must await them
    const courses = await getAllCourses();
    
    res.render('catalog/list', {
        title: 'Course Catalog',
        courses: courses
    });
};

// Route handler for individual course detail pages
const courseDetailPage = async (req, res, next) => {
    const courseParam = req.params.courseId;
    
    // Detect whether param is a numeric id or a slug (e.g. "cse-340")
    const isNumericId = /^\d+$/.test(courseParam);

    // Fetch course using the appropriate helper
    const course = isNumericId
        ? await getCourseById(Number(courseParam))
        : await getCourseBySlug(courseParam);
    
    // Our model returns empty object {} when not found, not null
    if (Object.keys(course).length === 0) {
        const err = new Error(`Course ${courseParam} not found`);
        err.status = 404;
        return next(err);
    }
    
    // Get sections using the course slug (catalog table uses slugs, not IDs)
    const sortBy = req.query.sort || 'time';
    const sections = await getSectionsByCourseSlug(course.slug, sortBy);
    
    res.render('catalog/detail', {
        title: `${course.courseCode} - ${course.name}`,
        course: course,
        sections: sections,
        currentSort: sortBy
    });
};

export { catalogPage, courseDetailPage };