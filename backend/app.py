from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
from pymongo import MongoClient
from bson import ObjectId
import os
from bson import ObjectId


app = Flask(__name__)
CORS(app)
CORS(app, resources={r"/*": {"origins": "*"}})

client = MongoClient("mongodb://localhost:27017/")
db = client["creative_db"]

accounts_col = db["accounts"]
dealers_col = db["dealerships"]
UPLOAD_FOLDER = "uploads"
OUTPUT_FOLDER = "outputs"

os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(OUTPUT_FOLDER, exist_ok=True)
os.makedirs(OUTPUT_FOLDER, exist_ok=True)


def serialize(doc):
    doc["_id"] = str(doc["_id"])
    return doc


@app.route("/accounts")
def get_accounts():
    accounts = list(accounts_col.find())
    return jsonify([serialize(a) for a in accounts])


@app.route("/dealerships/<account_id>")
def get_dealers(account_id):
    try:
        dealers = list(dealers_col.find({
            "account_id": ObjectId(account_id)
        }))

        result = []

        for dealer in dealers:
            result.append({
                "_id": str(dealer["_id"]),
                "name": dealer["name"]
            })

        return jsonify(result)

    except Exception as e:
        print("ERROR:", e)
        return jsonify({
            "error": str(e)
        }), 500
ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg"}


def allowed_file(filename):
    return (
        "." in filename
        and filename.rsplit(".", 1)[1].lower()
        in ALLOWED_EXTENSIONS
    )

import os, zipfile
from flask import request, jsonify, send_file
from bson import ObjectId

@app.route("/generate", methods=["POST"])
def generate():
    image = request.files.get("image")
    dealer_ids = request.form.getlist("dealers")

    if not image:
        return jsonify({"error": "No image uploaded"}), 400

    if not allowed_file(image.filename):
        return jsonify({"error": "Only png/jpg/jpeg allowed"}), 400

    os.makedirs(UPLOAD_FOLDER, exist_ok=True)
    os.makedirs(OUTPUT_FOLDER, exist_ok=True)

    upload_path = os.path.join(UPLOAD_FOLDER, image.filename)
    image.save(upload_path)

    generated_files = []

    for dealer_id in dealer_ids:
        dealer = dealers_col.find_one({"_id": ObjectId(dealer_id)})

        if not dealer:
            continue

        filename = dealer["name"].replace(" ", "_") + ".jpg"
        output_path = os.path.join(OUTPUT_FOLDER, filename)

        with open(upload_path, "rb") as f1:
            with open(output_path, "wb") as f2:
                f2.write(f1.read())

        generated_files.append(output_path)

    if len(generated_files) == 0:
        return jsonify({"error": "No files generated"}), 400

    zip_path = os.path.join(OUTPUT_FOLDER, "creatives.zip")

    with zipfile.ZipFile(zip_path, "w") as zipf:
        for file_path in generated_files:
            zipf.write(file_path, arcname=os.path.basename(file_path))

    return send_file(zip_path, as_attachment=True, download_name="creatives.zip")

@app.route("/dealer/<dealer_id>")
def get_dealer(dealer_id):
    from bson import ObjectId

    dealer = dealers_col.find_one({"_id": ObjectId(dealer_id)})

    if not dealer:
        return jsonify({"error": "Not found"}), 404

    return jsonify({
        "name": dealer["name"],
        "logo_url": f"http://127.0.0.1:5000/static/logos/{dealer['logo']}",
        "phone": dealer.get("phone", ""),
        "location": dealer.get("location", "")
    })

@app.route("/download/<filename>")
def download_file(filename):
    try:
        return send_from_directory(
            OUTPUT_FOLDER,
            filename,
            as_attachment=True
        )
    except Exception as e:
        return jsonify({
            "error": str(e)
        }), 404


if __name__ == "__main__":
    app.run(debug=True)