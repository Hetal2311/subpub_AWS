# subpub_AWS
subscribe/publish message from AWS to any Linux device and vice versa


Dynamodb to raspberry pi 
Process Flow:
                            Dynamodb
		                              	|
                            Lambda function
 		                               	|
                            Cloud Watch rule 1 to start LED
                            Cloud watch rule 2 to stop LED
                                    |
                             Cloud watch target
                                     |
                             Lambda function to publish topic
                                     |
                             .py file to subscribe topic and give output to pi 

1)	Dynamodb:
   tbl_LEDSchedule table 
   publishData         Triggers
2)	IAM
           Adminaccess  All actions
                                     All Resource
3)	Lambda function
                              publishData.js     Add trigger Dynamodb
                                                          Add ROLE  Adminaccess
                                                          
4)	Cloud watch Rule 
i)	Start_22_3 
Target function  publishTOLED
             Input Constant: {"LED_ID":"1","START_MINUTE":"3","START_HOUR":"22"}
ii)	Stop_22_5
Target function  publishTOLEDTOOFF
             Input Constant: {"LED_ID":"1","END_MINUTE":"5","END_HOUR":"22"}
   
5)	Lambda function
publishToLED.py:
Role: All

