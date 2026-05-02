from pymongo import MongoClient

client = MongoClient("mongodb://localhost:27017/")
db = client["creative_db"]

accounts = db["accounts"]
dealers = db["dealerships"]

accounts.delete_many({})
dealers.delete_many({})

# Insert accounts
tata_id = accounts.insert_one({
    "name": "Tata",
    "logo": "logo-dark.png"
}).inserted_id

vw_id = accounts.insert_one({
    "name": "Volkswagen",
    "logo": "vw.png"
}).inserted_id

# Insert dealerships
dealers.insert_many([
    {
        "name": "Bellad Tata",
        "account_id": tata_id,
        "logo": "logo-dark.png",
        "phone": "8238883535",
        "location": "Bommasandra | Sarjapur"
    },
    {
        "name": "VW Hubli",
        "account_id": vw_id,
        "logo": "vw.png",
        "phone": "9000000001",
        "location": "Hubli"
    },
    {
        "name": "VW Autobahn",
        "account_id": vw_id,
        "logo": "vw.png",
        "phone": "9000000002",
        "location": "Bangalore"
    }
])

print("Data inserted!")