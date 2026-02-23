export default class BaseChannel{
    async send(notification){
        throw new Error("send() not implemented");
    }
}