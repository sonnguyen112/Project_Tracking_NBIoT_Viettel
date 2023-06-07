import uvicorn
import multiprocessing
from app.process_mqtt import process_mqtt

if __name__ == "__main__":
    mqtt_process= multiprocessing.Process(target=process_mqtt)
    mqtt_process.start()
    uvicorn.run(app="app.main:app", host="0.0.0.0")