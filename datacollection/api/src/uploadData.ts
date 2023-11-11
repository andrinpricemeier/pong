import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import S3 from 'aws-sdk/clients/s3';
import { v4 as uuidv4 } from 'uuid';

const BUCKET_NAME = "pong";
const IAM_USER_KEY = "AKIA4T2ZID7KZFLDCUYX";
const IAM_USER_SECRET = "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";

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        const data = JSON.parse(event.body);
        const s3bucket = new S3({
            accessKeyId: IAM_USER_KEY,
            secretAccessKey: IAM_USER_SECRET
        });
        const params = {
            Bucket: BUCKET_NAME,
            Key: uuidv4() + ".json",
            Body: JSON.stringify(data)
        };
        console.log(params);
        await s3bucket.upload(params).promise();
        return {
            "isBase64Encoded": false,
            "statusCode": 200,
            "headers": { "Access-Control-Allow-Origin": "*" },
            "multiValueHeaders": {},
            "body": JSON.stringify({})
        };
    } catch (e) {
        console.log(e);
        return {
            "isBase64Encoded": false,
            "statusCode": 500,
            "headers": { "Access-Control-Allow-Origin": "*" },
            "multiValueHeaders": {},
            "body": JSON.stringify({})
        }
    }
}