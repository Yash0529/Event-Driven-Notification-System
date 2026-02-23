export default class BaseProvider{

    async send(notification){
        throw new Error("send() must be implemented");
    }
}