'use strict';
var AWS = require("aws-sdk");
AWS.config.update({region: 'ap-south-1'});
var cwevents = new AWS.CloudWatchEvents({apiVersion: '2015-10-07'});
var lambda = new AWS.Lambda({
        accessKeyId: 'AKIAJH4XC5REIFXDIPDA',
        secretAccessKey: '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',
        region: 'ap-south-1'
      });
    exports.handler = (event, context, callback) => {
    event.Records.forEach((record) =>  {
        console.log('Stream record14: ', JSON.stringify(record, null, 2));
        if (record.eventName == 'INSERT'){   
            var UNI=record.dynamodb.NewImage.LED_ID.S;
            var LED_ID = record.dynamodb.NewImage.LED_ID_NO.N;
            var START_HOUR = record.dynamodb.NewImage.START_HOUR.N;
            var START_MINUTE = record.dynamodb.NewImage.START_MINUTE.N;
            var END_HOUR = record.dynamodb.NewImage.END_HOUR.N;
            var END_MINUTE = record.dynamodb.NewImage.END_MINUTE.N;
            var cronExpression = "cron("+START_MINUTE+" "+START_HOUR+" * * ? *)";
            var ruleParams =   {
                 Name: 'start_' + START_HOUR + '_' + START_MINUTE,
                  Description: 'Start LED  ',
                  ScheduleExpression: cronExpression, 
                  State: 'ENABLED'    };
                  cwevents.putRule(ruleParams).promise()
                 .then(data => {
                     var lambdaPermission = {
                        FunctionName: 'arn:aws:lambda:ap-south-1:198677132032:function:publishToLED',
                        StatementId: 'start_' + UNI + '_' + START_HOUR + '_' + START_MINUTE,
                        Action: 'lambda:InvokeFunction',
                        Principal: 'events.amazonaws.com' };
                        return lambda.addPermission(lambdaPermission).promise();  })
                .then(data =>  {
                    var targetParams = {
                             Rule: ruleParams.Name,
                             Targets: [{
                                Id: 'default',
                                Arn: 'arn:aws:lambda:ap-south-1:198677132032:function:publishToLED',
                                Input: JSON.stringify({LED_ID:LED_ID,START_MINUTE:START_MINUTE,START_HOUR:START_HOUR}) }]          };
                     return cwevents.putTargets(targetParams).promise();    })
                .then(data => {
                     callback(null, data);     })
                .catch(err => {
                     callback(err)   }); 
               var cronExpressionOFF = "cron("+END_MINUTE+" "+END_HOUR+" * * ? *)";
               var ruleParamsOFF =     {
                      Name: 'stop_' + END_HOUR + '_' + END_MINUTE,
                      Description: 'Stop LED  ',
                      ScheduleExpression: cronExpressionOFF, 
                      State: 'ENABLED' };
                     cwevents.putRule(ruleParamsOFF).promise()
                     .then(data =>  {
                         var lambdaPermissionOFF = {
                            FunctionName: 'arn:aws:lambda:ap-south-1:198677132032:function:publishToLEDTOOFF',
                            StatementId: 'stop_' + UNI + '_' + END_HOUR + '_' + END_MINUTE,
                            Action: 'lambda:InvokeFunction',
                            Principal: 'events.amazonaws.com' };
                            return lambda.addPermission(lambdaPermissionOFF).promise();
                     } .then(data =>  {
                         var targetParamsOFF = {
                                 Rule: ruleParamsOFF.Name,
                                 Targets: [ {
                                    Id: 'default',
                                    Arn: 'arn:aws:lambda:ap-south-1:198677132032:function:publishToLEDTOOFF',
                                                                        Input: JSON.stringify({LED_ID:LED_ID,END_MINUTE:END_MINUTE,END_HOUR:END_HOUR}   } ]      };
                         return cwevents.putTargets(targetParamsOFF).promise();
                     })
                    .then(data => {
                         callback(null, data);
                    })
                    .catch(err => {
                         callback(err)
                    }); 
        }
    });
};


