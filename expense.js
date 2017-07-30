import uuid from 'uuid';
import * as dynamoDbLib from './libs/dynamodb-lib';
import { success, failure } from './libs/response-lib';

export async function create(event, context, callback) {
  const data = JSON.parse(event.body);
  const params = {
    TableName: 'expense',
    Item: {
      userId: event.requestContext.identity.cognitoIdentityId,
      expenseId: uuid.v1(),
      attachment: data.attachment,
      description: data.description,
      additionalInfo: data.additionalInfo,
      typeExpense: data.type,
      statusExpense: 0,
      createdAt: new Date().getTime(),
      date: data.date
    },
  };

  try {
    const result = await dynamoDbLib.call('put', params);
    callback(null, success(params.Item));
  }
  catch(e) {
      console.log(e);
    callback(null, failure({status: false}));
  }
};

export async function findOne(event, context, callback) {
    const params = {
        TableName: 'expense',
        Key: {
            userId: event.requestContext.identity.cognitoIdentityId,
            expenseId: event.pathParameters.id
        }
    };
    try {
        const result = await dynamoDbLib.call('get', params);
        callback(null, success(result.Item));
    } catch (error) {
        callback(null, failure({status: false}));
    }
}

export async function update(event, context, callback) {
    const data = JSON.parse(event.body);
    const params = {
        TableName: 'expense',
        Key: {
            userId: event.requestContext.identity.cognitoIdentityId,
            expenseId: event.pathParameters.id
        },
        UpdateExpression: 'SET  attachment = :attachment, description = :description, additionalInfo = :additionalInfo',
        ExpressionAttributeValues: {
            ':attachment': data.attachment ? data.attachment : null,
            ':description': data.description ? data.description : null,
            ':additionalInfo': data.additionalInfo ? data.additionalInfo: null
        }
    };
    try {
        const result = await dynamoDbLib.call('update', params);
        callback(null, success({status: true}));
    } catch (error) {
        console.log(error);
        callback(null, failure({status: false}));
    }
}

export async function del(event, context, callback) {
    const params = {
        TableName: 'expense',
        Key: {
            userId: event.requestContext.identity.cognitoIdentityId,
            expenseId: event.pathParameters.id
        }
    };
    try {
        const result = await dynamoDbLib.call('delete', params);
        callback(null, success({status: true}));
    } catch (error) {
        callback(null, failure({status: false}));
    }
}

export async function list(event, context, callback) {
    const params = {
        TableName: 'expense',
        KeyConditionExpression: 'userId = :userId',
        ExpressionAttributeValues: {
            ":userId": event.requestContext.identity.cognitoIdentityId,
        }
    }
    try {
        const result = await dynamoDbLib.call('query', params);
        callback(null,  success(result.Items));
    } catch (error) {
        console.log(error);
        callback(null, failure({status: false}));
    }   
}