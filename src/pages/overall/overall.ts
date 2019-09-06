import {Component, Prop, Vue} from 'vue-property-decorator';
import GraphOverall from '@/pages/overall/graph-overall/graph-overall';
import {Course} from '@/components/app/app';

@Component({
    components: {GraphOverall}
})
export default class Overall extends Vue
{
    @Prop({required: true}) courses: any;

    get convertCharts()
    {
        // Null case
        if (this.courses == null) return [];

        // Compute the column names
        let columns = ['date'];
        this.courses.forEach((course: Course) =>
        {
            columns.push(course.name);
        });

        // Find the min date
        let minDate: Date = new Date();
        this.courses.forEach((course: Course) =>
        {
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
        this.courses.forEach((course: Course) =>
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
            this.courses.forEach((course: Course) =>
            {
                // Reversed loop through the assignments
                for (let r = courseIndexes[course.name]; r >= 0; r--)
                {
                    let assignment = course.assignments[r];
                    let assignmentDate = new Date(assignment.date);

                    // Date is being looked at
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
}
