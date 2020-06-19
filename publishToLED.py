import boto3
print('Loading function')
def lambda_handler(event, context):
    print("Received event: " + str(event))
    message = {
           'LED_ID': json.loads(event['LED_ID']),
           'status':1
    }
    boto3.client(
           'iot-data',
           region_name='ap-south-1',
           aws_access_key_id='AKIAJH4XC5REIFXDIPDA',
           aws_secret_access_key='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').publish(
               topic='test/pub',
               payload=json.dumps(message),
               qos=1
