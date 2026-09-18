from flask import Flask, request, jsonify
from flask_cors import CORS
from ultralytics import YOLO
import cv2
import numpy as np


# ==========================================
# ACAN AI SERVER
# ==========================================

app = Flask(__name__)

# Allow React frontend
CORS(app)


# ==========================================
# LOAD YOLO MODEL
# ==========================================

print("====================================")
print("Loading ACAN YOLOv8 Model...")
print("====================================")

model = YOLO("yolov8n.pt")

print("YOLOv8 Loaded Successfully!")
print("AI Server Ready")
print("====================================")


# ==========================================
# ANIMAL CLASSES
# ==========================================

ANIMAL_CLASSES = {
    "bird",
    "cat",
    "dog",
    "horse",
    "sheep",
    "cow",
    "elephant",
    "bear",
    "zebra",
    "giraffe"
}


# ==========================================
# MINIMUM CONFIDENCE
# ==========================================

CONFIDENCE_THRESHOLD = 0.45


# ==========================================
# HOME
# ==========================================

@app.route("/")
def home():

    return jsonify({
        "app": "ACAN AI Server",
        "status": "Running",
        "model": "YOLOv8",
        "storage": "Images are NOT stored",
        "mode": "Memory Detection"
    })


# ==========================================
# AI DETECTION
# ==========================================

@app.route("/detect", methods=["POST"])
def detect():

    # --------------------------------------
    # CHECK IMAGE
    # --------------------------------------

    if "image" not in request.files:

        return jsonify({
            "success": False,
            "message": "No camera frame received"
        }), 400


    try:

        # ----------------------------------
        # READ IMAGE DIRECTLY INTO MEMORY
        # ----------------------------------

        image_file = request.files["image"]

        image_bytes = image_file.read()


        # ----------------------------------
        # CONVERT BYTES → NUMPY
        # ----------------------------------

        np_array = np.frombuffer(
            image_bytes,
            np.uint8
        )


        # ----------------------------------
        # CONVERT NUMPY → OPENCV IMAGE
        # ----------------------------------

        frame = cv2.imdecode(
            np_array,
            cv2.IMREAD_COLOR
        )


        if frame is None:

            return jsonify({
                "success": False,
                "message": "Invalid camera frame"
            }), 400


        # ----------------------------------
        # YOLO DETECTION
        # ----------------------------------

        results = model(
            frame,
            verbose=False,
            conf=CONFIDENCE_THRESHOLD
        )


        detections = []


        # ----------------------------------
        # PROCESS RESULTS
        # ----------------------------------

        for result in results:

            for box in result.boxes:

                # Class ID
                cls = int(
                    box.cls[0]
                )


                # Confidence
                confidence = float(
                    box.conf[0]
                )


                # Object name
                label = model.names[cls]


                # --------------------------------
                # IGNORE NON-ANIMAL OBJECTS
                # --------------------------------

                if label not in ANIMAL_CLASSES:

                    continue


                # --------------------------------
                # ADD ANIMAL DETECTION
                # --------------------------------

                detections.append({

                    "animal": label,

                    "confidence": round(
                        confidence * 100,
                        2
                    )

                })


        # ----------------------------------
        # RESPONSE
        # ----------------------------------

        return jsonify({

            "success": True,

            "totalDetections": len(
                detections
            ),

            "detections": detections

        })


    except Exception as error:

        print(
            "===================================="
        )

        print(
            "AI DETECTION ERROR:"
        )

        print(
            str(error)
        )

        print(
            "===================================="
        )


        return jsonify({

            "success": False,

            "message": str(error)

        }), 500


# ==========================================
# START SERVER
# ==========================================

if __name__ == "__main__":

    print("")
    print("====================================")
    print("🚆 ACAN AI SERVER")
    print("====================================")
    print("Port : 5001")
    print("Storage : DISABLED")
    print("Detection : MEMORY ONLY")
    print("====================================")
    print("")

    app.run(

        host="0.0.0.0",

        port=5001,

        debug=True

    )