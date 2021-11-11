import mongoose from 'mongoose'

const connectDB = async (uri) => {
	try {
		const con = await mongoose.connect(process.env.MONGO_URI, {
			useUnifiedTopology: true,
			useNewUrlParser: true,
		})
		console.log(`DB connected ${con.connection.host}`)
	} catch (error) {
		console.error(`Error : ${error.message}`)
		process.exit(1)
	}
}

export default connectDB
