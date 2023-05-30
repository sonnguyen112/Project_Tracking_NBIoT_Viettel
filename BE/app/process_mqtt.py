import paho.mqtt.client as mqttClient
import time
from sqlalchemy.orm import Session
from .database import get_db
from fastapi import Depends
from . import models
from sqlalchemy import desc
import json
import geopy.distance

THRESH_DISTANCE = 50
  
def on_connect(client, userdata, flags, rc):
  
    if rc == 0:
  
        print("Connected to broker")
  
        global Connected                #Use global variable
        Connected = True                #Signal connection 
  
    else:
  
        print("Connection failed")
  
def on_message(client, userdata, message, db: Session = next(get_db())):
    print(message.payload.decode())
    data = json.loads(message.payload.decode())
    last_record = db.query(models.DeviceInfo).order_by(desc(models.DeviceInfo.created_at)).first()
    if last_record == None:
        new_record = models.DeviceInfo(longtitude = data["longtitude"], latitude = data["latitude"])
        db.add(new_record)
        db.commit()
    else:
        last_coord = (last_record.latitude, last_record.longtitude)
        new_coord = (data["latitude"], data["longtitude"])
        distance = geopy.distance.geodesic(last_coord, new_coord).meters
        print(distance)
        if (distance > THRESH_DISTANCE):
            new_record = models.DeviceInfo(longtitude = data["longtitude"], latitude = data["latitude"])
            db.add(new_record)
            db.commit()

Connected = False   #global variable for the state of the connection
  
broker_address= "mqtt.innoway.vn"  #Broker address
port = 1883                         #Broker port
user = "test_user"                    #Connection username
password = "bSRmI734p6Km2YhLR6wdkqy1x7NHsj33"            #Connection password
  
client = mqttClient.Client("Python")               #create new instance
client.username_pw_set(user, password=password)    #set username and password
client.on_connect= on_connect                      #attach function to callback
client.on_message= on_message                      #attach function to callback
  
client.connect(broker_address, port=port)          #connect to broker
  
client.loop_start()        #start the loop
  
while Connected != True:    #Wait for connection
    time.sleep(0.1)
  
client.subscribe("messages/6b88a402-9679-499b-83fc-9502d113df22/attributets")
  
def process_mqtt():  
    try:
        while True:
            time.sleep(1)
    
    except KeyboardInterrupt: 
        print("exiting")
        client.disconnect()
        client.loop_stop()