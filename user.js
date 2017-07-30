import uuid from 'uuid';
import * as dynamoDbLib from './libs/dynamodb-lib';
import { success, failure } from './libs/response-lib';

export async function create(event, context, callback) {
    const data = JSON.parse(event.body);
    const params = {
        TableName: 'userCustom',
        Item: {
            userId: event.requestContext.identity.cognitoIdentityId,
            userCustomId: uuid.v1(),
            nameFull: data.name,
            bankAccount: data.bankAccount
        }
    };
    try {
        const result = await dynamoDbLib.call('put', params);
        callback(null, success(params.Item));
    } catch (error) {
        callback(null, failure({status: false}));
    }
};

export async function update(event, context, callback) {
    const data = JSON.parse(event.body);
    const params = {
        TableName: 'userCustom',
        Key: {
            userId: event.requestContext.identity.cognitoIdentityId,
            userCustomId: event.pathParameters.id
        },
        UpdateExpression: 'SET nameFull = :nameFull, bankAccount = :bankAccount',
        ExpressionAttributeValues: {
            ':nameFull': data.name ? data.name : null,
            ':bankAccount': data.bankAccount ? data.bankAccount : null,
        },
        ReturnValues: 'ALL_NEW',
    };
    try {
        const result = await dynamoDbLib.call('update', params);
        callback(null, success({status: true}));
    } catch (error) {
        console.log(error);
        callback(null, failure({status: false}));
    }
};
export async function findOne(event, context, callback) {
    const params = {
        TableName: 'userCustom',
        Key: {
            userId: event.requestContext.identity.cognitoIdentityId,
            userCustomId: event.pathParameters.id
           }
    };
    try {
        const result = await dynamoDbLib.call('get', params);
        callback(null, success(params.Item));
    } catch (error) {
        callback(null, failure(null, {status: false}));
    }
}