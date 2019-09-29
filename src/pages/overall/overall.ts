import {Component, Prop, Vue} from 'vue-property-decorator';
import GraphOverall from '@/pages/overall/graph-overall/graph-overall';
import {Course} from '@/components/app/app';
import {GPAUtils} from '@/utils/gpa-utils';
import {CourseUtils} from '@/utils/course-utils';

@Component({
    components: {GraphOverall}
})
export default class Overall extends Vue
{
    // @ts-ignore
    @Prop({required: true}) courses: Course[];

    /**
     * Convert assignments list to a graph dataset.
     */
    get convertCharts()
    {
        // Null case
        if (this.courses == null) return [];

        // Filter it
        let courses: Course[] = CourseUtils.getGradedCourses(this.courses);

        // Compute the column names
        let columns = ['date'];
        courses.forEach(course =>
        {
            columns.push(course.name);
        });

        // Find the min date
        let minDate: Date = new Date();
        courses.forEach(course =>
        {
            if (course.assignments.length == 0) return;
            let date = new Date(course.assignments[course.assignments.length - 1].date);
            if (date < minDate) minDate = date;
        });

        // Find the dates in between
        let now = new Date();
        let dates = [];
        for (let date = minDate; date <= now; date.setDate(date.getDate() + 1))
        {
            dates.push(new Date(date));
        }

        // Initialize course specific variables
        let courseScores: {[index: string]: any} = {};
        let courseMaxScores: {[index: string]: any} = {};
        let courseIndexes: {[index: string]: any} = {};
        courses.forEach(course =>
        {
            courseScores[course.name] = 0;
            courseMaxScores[course.name] = 0;
            courseIndexes[course.name] = course.assignments.length - 1;
        });

        // Compute the rows data
        let rows: {[index: string]: any}[] = [];
        dates.forEach(date =>
        {
            // Define row object
            let row: {[index: string]:any} = {'date': date.toLocaleDateString('en-US')};

            // Loop through courses
            courses.forEach(course =>
            {
                // Reversed loop through the assignments
                for (let r = courseIndexes[course.name]; r >= 0; r--)
                {
                    let assignment = course.assignments[r];

                    // If assignment should be displayed
                    if (assignment.complete != 'Complete') continue;

                    // Date is being looked at
                    let assignmentDate = new Date(assignment.date);
                    if (assignmentDate.getTime() == date.getTime())
                    {
                        // Record scores
                        courseScores[course.name] += assignment.score;
                        courseMaxScores[course.name] += assignment.scoreMax;
                    }

                    // Not now
                    else if (assignmentDate > date)
                    {
                        courseIndexes[course.name] = r;
                        break;
                    }
                }

                // Add average to the row
                row[course.name] = courseScores[course.name] / courseMaxScores[course.name] * 100;
            });

            // Add it to the array
            rows.push(row);
        });

        console.log(rows);

        return {
            columns: columns,
            rows: rows
        }
    }

    /**
     * This function is called to get gpa since I can't import another
     * class in the Vue file.
     */
    public getGPA()
    {
        let gpa = GPAUtils.getGPA(this.courses);
        // let result = '' + gpa.gpa;

        /* Not accurate
        if (!gpa.accurate)
        {
            result = `(${result})`;
        }*/

        return gpa;
    }
}
