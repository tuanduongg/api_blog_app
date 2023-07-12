import mongoose from "mongoose";
const URI = process.env.MONGO_URI || 'mongodb+srv://toilatuan:Toilatuan201%40@toilatuan.bcqetr5.mongodb.net/dashboardDB?retryWrites=true&w=majority' ;

const connect = async () => {
    try {
        let connection = await mongoose.connect(URI);   
        console.log('database connected!');
        return connection;
    } catch (error) {
        console.log('err',error);
        process.exit(1);
    }
}
export default connect;