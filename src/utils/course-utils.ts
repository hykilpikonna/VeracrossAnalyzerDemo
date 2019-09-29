import {Course} from '@/components/app/app';

export class CourseUtils
{
    /**
     * Return a list of courses that are graphed
     *
     * @param original Original course list
     * @return Course[] Filtered course list
     */
    public static getGradedCourses(original: Course[]): Course[]
    {
        // Define result
        let result: Course[] = [];

        // Filter through courses
        original.forEach(course =>
        {
            // Skip future or past courses
            if (course.status != 'active') return;

            // Skip courses without levels
            if (course.level == 'None') return;

            // Skip courses without assignments
            if (course.assignments.length == 0) return;

            // Add it to the list
            result.push(course);
        });

        return result;
    }
}