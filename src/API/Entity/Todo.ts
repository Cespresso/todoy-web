export default class Todo {
    public id: number;
    public userId: string;
    public completed: boolean;
    public title: string;
    public body: string;

    constructor(title: string, body: string);
    constructor(title: string, body: string, id?: number, userId?: string, completed?: boolean){
        this.id = id || null;
        this.userId = userId || null;
        this.completed = completed || false;
        this.title = title || null;
        this.body = body || null;
    }

}