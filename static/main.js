
var mainUrl = 'http://localhost:8000/tasks/';

var app = new Vue({
    el: '#app',
    data: {
        csrf: null,
        task: {title: ''},
        tasks: []
    },
    methods: {
        async sendRequest(url, method, data){
            var myHeaders = new Headers({
                'Content-Type': 'application/json',
                'X-Requested-With': 'XMLHttpRequest'
            });

            if (method !== 'get'){
                myHeaders.set('X-CSRFToken', await this.getCsrfToken())
            };

            var response = await fetch(url, {
                method: method,
                headers: myHeaders,
                body: data
            });

            return response
        },
        async getCsrfToken(){
            if(this.csrf === null){
                var response = await this.sendRequest(mainUrl + 'csrf/', 'get');
                var data = await response.json();
                this.csrf = data.csrf_token;
            };
            return this.csrf;
        },
        async getTasks(){
            var response = await this.sendRequest(mainUrl, 'get');
            this.tasks = await response.json();
        },
        async createTask(){
            await this.getTasks();

            await this.sendRequest(mainUrl, 'post', JSON.stringify(this.task));

            this.task.title = '';

            await this.getTasks();
        },
        async completeTask(task){
            await this.sendRequest(mainUrl, 'put', JSON.stringify(task));

            await this.getTasks();
        },
        async deleteTask(task){
            await this.sendRequest(mainUrl, 'delete', JSON.stringify(task));

            await this.getTasks();
        }
    },
    async created(){
        await this.getTasks();
    }
})