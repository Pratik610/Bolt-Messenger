import express from 'express'
import multer from 'multer'
import path from 'path'
import { protect } from '../middleware/authMiddleware.js'
const router = express.Router()

const storage = multer.diskStorage({
	destination(req, file, cb) {
		cb(null, 'uploads/')
	},
	filename(req, file, cb) {
		cb(
			null,
			`${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
		)
	},
})

const checkFileSize = (file, cb) => {
	if (file.size < 10000000) {
		return cb(null, true)
	} else {
		cb('File Size should be under 10mb')
	}
}

const upload = multer({
	storage,
	limits: function (req, file, cb) {
		checkFileSize(file, cb)
	},
})

router.post('/', protect, upload.single('file'), (req, res) => {
	res.send(`/${req.file.path}`)
})

export default router
