/**
 * This is an utility class to calculate GPA.
 */
import {Course} from '@/components/app/app';

export class GPAUtils
{
    // [[Min score, Letter grade, Base GPA], ...]
    public static SCALE =
    [
        [96.5, 'A+', 4.00],
        [92.5, 'A' , 3.75],
        [89.5, 'A-', 3.50],
        [86.5, 'B+', 3.25],
        [82.5, 'B' , 3.00],
        [79.5, 'B-', 2.75],
        [76.5, 'C+', 2.50],
        [72.5, 'C' , 2.25],
        [70.5, 'C-', 2.00],
        [69.5, 'D' , 1.00],
        [0   , 'F' , 0.00]
    ];

    // Keywords
    public static MIN = 0;
    public static LETTER = 1;
    public static GPA = 2;

    /**
     * Calculate GPA for a list of couses
     *
     * @param coursesOriginal List of courses
     */
    public static getGPA(coursesOriginal: Course[]): {gpa: number, accurate: boolean}
    {
        // Clone array
        let courses: Course[] = [];

        // Accurate or not
        let accurate: boolean = true;

        // Remove all courses that does not have a grade
        coursesOriginal.forEach(course =>
        {
            if (course.numericGrade == null)
            {
                accurate = false;
            }
            else if (course.level != 'none')
            {
                courses.push(course);
            }
        });

        // If no course have grade, return -1
        if (courses.length == 0)
        {
            return {gpa: -1, accurate: false};
        }

        // Count total GPA
        let totalGPA = 0;
        courses.forEach(course =>
        {
            totalGPA += this.getGP(course);
        });

        // Get average GPA, round to two decimal places
        let gpa = Math.round(totalGPA / courses.length * 100) / 100;

        // Return results
        return {gpa: gpa, accurate: accurate};
    }

    /**
     * Calculate GPA for a course
     *
     * @param course Course
     */
    public static getGP(course: Course): number
    {
        // Find the GPA for this course.
        for (let scale of this.SCALE)
        {
            // Letter grades are the same
            if (scale[this.LETTER] == course.letterGrade)
            {
                // Get grade and add it
                let grade = <number> scale[this.GPA];

                // Add scaleUp if not failed.
                if (grade != 0) grade += course.scaleUp;

                // That's it
                return grade;
            }
        }

        return -1;
    }
}