const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let categorySchema = new Schema({
    name: {
        type: String,
        unique: true,
        required: [true, 'Es necesario el nombre']
    },
    state: {
        type: Boolean,
        default: true
    },
    user: {
        type: Schema.Types.ObjectId, ref: 'User'
    }
})

module.exports = mongoose.model('Category', categorySchema)
