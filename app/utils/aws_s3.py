# app/utils/aws.py

import os
from datetime import time

import boto3

# Initialize S3 client
s3 = boto3.client(
    's3',
    aws_access_key_id=os.getenv('AWS_ACCESS_KEY_ID'),
    aws_secret_access_key=os.getenv('AWS_SECRET_ACCESS_KEY'),
    region_name=os.getenv('AWS_REGION')
)

BUCKET_NAME = os.getenv('AWS_BUCKET_NAME')

def upload_file_to_s3(file, public=False):
    """Upload a file to AWS S3."""
    try:
        # Set up the file name and S3 parameters
        file_name = file.filename
        key = f"{int(time.time())}_{file_name}"  # Unique filename
        content_type = file.content_type

        # Upload the file
        s3.upload_fileobj(
            file,
            BUCKET_NAME,
            key,
            ExtraArgs={'ContentType': content_type}
        )

        if public:
            s3_url = f"https://{BUCKET_NAME}.s3.{os.getenv('AWS_REGION')}.amazonaws.com/{key}"
            return s3_url
        else:
            return key  # For private files, return the key instead of URL

    except Exception as e:
        print(f"Error uploading file: {e}")
        return None
