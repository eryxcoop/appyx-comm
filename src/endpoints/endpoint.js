import {DefaultSuccessfulResponse} from "../responses/generalResponses/DefaultSuccessfulResponse";
import AuthenticationErrorResponse from "../responses/generalResponses/AuthenticationErrorResponse";
import PermissionErrorResponse from "../responses/generalResponses/PermissionErrorResponse";
import {ParametersValidationErrorResponse} from "../responses/generalResponses/ParametersValidationErrorResponse";
import {ParameterValidationErrorResponse} from "../responses/generalResponses/ParameterValidationErrorResponse";
import {SimpleErrorResponse} from "../responses/generalResponses/SimpleErrorResponse";
import UnexpectedErrorResponse from "../responses/generalResponses/UnexpectedErrorResponse";


export default class Endpoint {

    static getMethod() {
        return 'GET'
    }

    static postMethod() {
        return 'POST'
    }

    static url() {
        throw new Error("You have to implement the method");
    }

    generalResponses() {
        return [
            DefaultSuccessfulResponse,
            AuthenticationErrorResponse,
            PermissionErrorResponse,
            SimpleErrorResponse,
            ParametersValidationErrorResponse,
            ParameterValidationErrorResponse,
            UnexpectedErrorResponse,
        ]
    }

    ownResponses() {
        /*
            Override this in order to provide custom responses
        "*/
        return []
    }

    responses() {
        /*
            Own responses have more precedence over the general responses
        "*/
        return this.ownResponses().concat(this.generalResponses())
    }

    url() {
        return this.constructor.url();
    }

    contentType() {
        return 'application/json';
    }

    method() {
        throw new Error("You have to implement the method");
    }

    needsAuthorization() {
        throw new Error("You have to implement the method");
    }

    isGetMethod(){
        return this.method() === this.constructor.getMethod()
    }

    adaptValues(values){
        return values
    }
}
