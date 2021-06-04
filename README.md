# File uploads with AWS Cognito and S3

This repo serves as a proof of concept to use AWS Cognito to upload files for authenticated users.

## Development

Create a new file `.env` and copy the variables from `.env.sample` file. Insert your AWS credentials.

Run `yarn install` to install the dependecies.

Run `yarn dev` to start the app.

## References

Policy reference - https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_examples_s3_cognito-bucket.html

Generate presigned url - https://aws.amazon.com/blogs/developer/generate-presigned-url-modular-aws-sdk-javascript/

S3 CRUD example - https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/s3-example-photo-album.html

SDK S3 client docs - https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-s3/index.html
