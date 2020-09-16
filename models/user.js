const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let Schema = mongoose.Schema;
let validations = {
    roles: {
        values: ['ADMIN_ROLE', 'USER_ROLE'],
        message:  '{VALUE} no es valido'
    }
}

let userSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Es necesario el nombre']
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'Es necesario el correo']
    },
    password: {
        type: String,
        required: [true, 'Es necesario la contraseña']
    },
    img: {
        type: String,
        required: false
    },
    role: {
        type: String,
        default: 'USER_ROLE',
        enum: validations.roles
    },
    state: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: false
    }
})

//hiding password
// userSchema.methods.toJSON = function () {
//     let user = this;
//     let userObj = user.toObject()
//     delete userObj.password
// }

userSchema.plugin(uniqueValidator, { message:'{PATH} debe de ser único'});

module.exports = mongoose.model('User', userSchema)
