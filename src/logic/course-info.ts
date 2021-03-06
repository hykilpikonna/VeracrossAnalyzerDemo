import {CourseUtils} from '@/logic/utils/course-utils';

export default class CourseInfo
{
    id_ci: number
    year: number
    name: string
    teacher: string
    level: string
    courseIds: number[]

    uniqueName: string
    courseCount: number
    gradeLevels: number[]
    enrollments: number
    classes: ClassInfo[]
    levelID: number;
    levelFull: string

    rating: AnalyzedRating = null as any as AnalyzedRating

    /**
     * Construct with a json object
     *
     * @param json
     */
    constructor(json: any)
    {
        this.id_ci = json.id_ci
        this.year = json.year
        this.name = json.name.trim().replace('&amp;', '&').replace('&quot;', '"')
        this.teacher = json.teacher
        this.level = json.level
        this.courseIds = json.courseIds.split('|').map((id: string) => +id);

        this.courseCount = this.courseIds.length;
        this.gradeLevels = [];
        this.uniqueName = CourseInfo.toUniqueName(this.name);
        this.enrollments = 0;
        this.classes = []
        this.levelID = CourseUtils.getLevelID(this.level);
        this.levelFull = CourseUtils.getLevelFullName(this.level);
    }

    static toUniqueName(name: string)
    {
        return name
            .replace(/( Semester| Full Year|)/g, '')
            .replace(/( Accelerated| Honors| College Prep|)/g, '')
            .replace(/( A| Acc| CP| H| \(.*\))$/g, '');
    }
}

export class UniqueCourse
{
    name: string
    courses: CourseInfo[]
    enrollments: number

    constructor(name: string, courses: CourseInfo[], enrollments: number)
    {
        this.name = name;
        this.courses = courses;
        this.enrollments = enrollments;
    }

    get classes()
    {
        return this.courses.flatMap(c => c.classes);
    }
}

export class ClassInfo
{
    id: number
    name: string
    teacher: string
    level: string

    uniqueName: string

    /**
     * Construct with a json object
     *
     * @param json
     */
    constructor(json: any)
    {
        this.id = json.id;
        this.name = json.name.trim().replace('&amp;', '&').replace('&quot;', '"')
        this.teacher = json.teacher
        this.level = json.level;

        this.uniqueName = CourseInfo.toUniqueName(this.name);
    }
}

export class CourseInfoRating
{
    id_ci: number
    id_user: number
    firstName: string
    lastName: string
    anonymous: boolean
    ratings: number[]
    comment: string

    averageRating: number = 0

    constructor(json: any)
    {
        this.id_ci = json.id_ci;
        this.id_user = json.id_user;
        this.anonymous = this.id_user == -1;
        this.ratings = json.ratings;
        this.comment = json.comment;

        if (json.userFullName != null)
        {
            let nameSplit = json.userFullName.split(']=[');
            this.firstName = nameSplit[0];
            this.lastName = nameSplit[1];
        }

        this.ratings.forEach(r => this.averageRating += r);
        this.averageRating /= 5;
    }

    /**
     * Create new for posting to the server
     * @param id_ci
     */
    public static createNew(id_ci: number)
    {
        return new CourseInfoRating({id_ci: id_ci, id_user: -2, userFullName: null,
            anonymous: false, ratings: [0,0,0,0,0], comment: ''})
    }
}

export class AnalyzedRating
{
    ratingCounts: number[][] // ratingCounts[criteria][stars] = count
    ratingSums: number[] // ratingSums[criteria] = total stars
    totalCount: number

    ratingAverages: number[] = [] // ratingAverages[criteria] = average
    overallRating: number = 0

    constructor(json: any)
    {
        this.ratingCounts = json.ratingCounts;
        this.ratingSums = json.ratingSums;
        this.totalCount = json.totalCount;

        // No ratings
        if (this.totalCount == 0)
        {
            this.overallRating = -1;
            return;
        }

        // Calculate overall rating
        this.ratingSums.forEach((criteriaScore, i) => this.overallRating += this.ratingAverages[i] = criteriaScore / this.totalCount);
        this.overallRating /= this.ratingAverages.length;
    }
}

export const RATING_CRITERIA: {title: string, desc: string}[] =
[
    {title: 'Enjoyable', desc: 'How enjoyable is the course?'},
    {title: 'Knowledge', desc: 'How interesting is the content of the course? ' +
            'Is it something you feel worth learning?'},
    {title: 'Interactivity', desc: 'How interesting is the teacher? Is the teacher interactive?'},
    {title: 'Eloquence', desc: `Are the teacher's lectures easy to understand?`},
    {title: 'Fairness', desc: `How fair is the teacher's grading? Is credit given in proportion to effort?`}
];
