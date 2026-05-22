export const Config = {
    development: {
        db: process.env.MONGO_URI || "mongodb://haman:987321@ac-qtglh0v-shard-00-00.ffmil8t.mongodb.net:27017,ac-qtglh0v-shard-00-01.ffmil8t.mongodb.net:27017,ac-qtglh0v-shard-00-02.ffmil8t.mongodb.net:27017/?replicaSet=atlas-4qe02s-shard-0&ssl=true&authSource=admin&retryWrites=true&w=majority&appName=Cluster0",
    },
    production: {
        db: process.env.MONGO_URI || "",
    },
};

export default Config;
