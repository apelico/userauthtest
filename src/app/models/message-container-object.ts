import { MessageObject } from "./message-object";

export class MessageContainerObject {
    id: string;
    usernameOne: string;
    usernameTwo: string;
    messages: MessageObject[] = [];

    constructor(user: string){
        this.id = "Testing";
        this.usernameOne = "austin";
        this.usernameTwo = user;
        this.messages = [];
    }
}
