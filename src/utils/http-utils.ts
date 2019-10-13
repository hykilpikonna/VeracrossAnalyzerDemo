import Constants from '@/constants';

export class HttpUtils
{
    public token: string = '';

    public post(node: string, body: any): Promise<any>
    {
        // Add token
        if (this.token != '') body['token'] = this.token;

        // Create promise
        return new Promise<any>((resolve, reject) =>
        {
            // Fetch request
            fetch(`${Constants.API_URL}${node}`, {method: 'POST', body: JSON.stringify(body)}).then(res =>
            {
                // Get response body text
                res.text().then(text =>
                {
                    // Parse response
                    let response = JSON.parse(text);
                    resolve(response);
                })
                .catch(reject)
            })
            .catch(reject)
        });
    }
}
