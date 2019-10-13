import {Component, Prop, Vue} from 'vue-property-decorator';
import {Assignment, Course} from '@/components/app/app';
import moment from 'moment';

@Component({
})
export default class UnreadEntry extends Vue
{
    // @ts-ignore
    @Prop({required: true}) assignment: Assignment;

    /**
     * Format a date to the displayed format
     *
     * @param date Date
     */
    getMoment(date: string)
    {
        return moment(new Date(date));
    }

    /**
     * Mark this unread assignment as read
     */
    markAsRead()
    {
        this.$emit('mark-as-read', this.assignment)
    }
}
