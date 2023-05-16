const AWS = require('aws-sdk');
// const FirebaseNotification = require('./firebase-notification');
// const { v4: uuidV4 } = require('uuid');

const dynamodb = new AWS.DynamoDB({ apiVersion: '2012-08-10' });
// const firebase = new FirebaseNotification();

/**
 *
 * @param {string} TableName
 * @param {object} Item
 * @returns {Promise<any>}
 */
async function putItemToDynamoDB(TableName, Item) {
  const params = {
    TableName: TableName,
    Item: Item,
  };

  return await dynamodb.putItem(params).promise();
}

/**
 *
 * @param {String} item
 * @returns {Boolean}
 *
 * @description - check if the item / string is a valid JSON or not
 */
const isJSON = (item) => {
  let operationalItem = typeof item !== 'string' ? JSON.stringify(item) : item;

  try {
    operationalItem = JSON.parse(operationalItem);
  } catch (e) {
    return false;
  }

  if (typeof operationalItem === 'object' && item !== null) {
    return true;
  }

  return false;
};

module.exports.sendNotification = async (event) => {
  console.log('Invoked Function...!');

  const dynamoTableName = process.env.DYNAMODB_TABLE;

  const records = event.Records;
  const allMessage = [];

  for (const record of records) {
    const {
      messageId,
      messageAttributes,
      attributes,
      body: messageBody,
    } = record;

    allMessage.push(messageBody);

    await putItemToDynamoDB(dynamoTableName, {
      id: { S: messageId },
      messageBody: { S: messageBody },
      messageAttributes: {
        S: isJSON(messageAttributes)
          ? JSON.stringify(messageAttributes)
          : messageAttributes,
      },
      attributes: {
        S: isJSON(attributes) ? JSON.stringify(attributes) : attributes,
      },
      createdAt: { S: new Date().toISOString() },
      updatedAt: { S: new Date().toISOString() },
    });

    // :Todo: Send Notification Here
    // firebase.sendNotification('', {}, {});
  }

  return allMessage;
};
