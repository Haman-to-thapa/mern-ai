import mongoose from 'mongoose';
import dotenv from 'dotenv'

dotenv.config()

// Standard connection string (bypasses SRV DNS lookup that fails on mobile networks)
const uri = "mongodb://development:NWaH5J3BTroXq8cO@taskplanet-development-shard-00-00.2nrlh.mongodb.net:27017,taskplanet-development-shard-00-01.2nrlh.mongodb.net:27017,taskplanet-development-shard-00-02.2nrlh.mongodb.net:27017/taskplanet?replicaSet=atlas-8xkb0n-shard-0&ssl=true&authSource=admin&retryWrites=true&w=majority&appName=taskplanet-development";

const mongooseOptions = {
    serverSelectionTimeoutMS: 30000,
    socketTimeoutMS: 45000,
    connectTimeoutMS: 30000,
};

async function updateCharges(): Promise<void> {
    try {
        await mongoose.connect(uri, mongooseOptions);
        console.log("Connected to MongoDB for update");

        const collection = mongoose.connection.collection('withdraw-charges');

        const result = await collection.updateOne(
            { charge_create_id: "taskplanet_withdraw_charge" },
            {
                $set: {
                    charge_percentage: 20,
                    premium_user_charge_percentage: 10,
                    premium_plus_user_charge_percentage: 5
                }
            }
        );

        if (result.matchedCount > 0) {
            console.log("Successfully updated withdrawal charges to 20%/10%/5%");
            console.log(`Matched ${result.matchedCount} and modified ${result.modifiedCount} document(s).`);
        } else {
            console.log("Withdraw charge record (taskplanet_withdraw_charge) NOT found in database.");
        }

        await mongoose.disconnect();
    } catch (err) {
        console.error("Migration Error:", err);
    }
}

updateCharges();
