import {Component, Vue} from 'vue-property-decorator';
import Constants from '@/constants';

/**
 * This component handles user login, and obtains data from the server.
 */
@Component({
    components: {},
})
export default class Login extends Vue
{
    public username: any = '';
    public password: any = '';

    public loading: boolean = false;
    public error: String = 'asdf';

    /**
     * On click, sends username and password to the server.
     */
    public onLoginClick()
    {
        // Make login button loading
        this.loading = true;

        // Fetch request TODO: Add username and password when the https server is ready.
        fetch(`${Constants.API_URL}/api/login`,
            {body: JSON.stringify({username: this.username, password: this.password})})
        .then(res =>
        {
            // Get response body text
            res.text().then(text =>
            {
                // Call custom event with courses info
                this.$emit('login:courses', JSON.parse(text));
            })
        })
        .catch(err =>
        {
            alert(err);

            // Allow the user to retry
            this.loading = false;
        });
    }
}
