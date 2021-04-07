export class MessageObject {
    content: string;
    date: string;
    owner: string;

    constructor(message: string, owner: string) {
        this.content = message;
        this.owner = owner;
    }
}
