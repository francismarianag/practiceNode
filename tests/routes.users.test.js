const mongoose = require('mongoose');
const User = require('../models/user');
const userData = { name: 'testUnit', email: 'testx@tesx.com', password: '1234' };



describe('User Model Test', () => {

    beforeAll(async () => {
        await mongoose.connect('mongodb://localhost:27017/practicaNode', { useNewUrlParser: true }, (err) => {
            if (err) {
                console.error(err);
                process.exit(1);
            }
        });
    });

    // Cleans up database between each test
    afterEach(async () => {
        await User.findOneAndDelete({
            email : userData.email
        })
    })

    it('create & save user successfully', async () => {
        const validUser = new User(userData);
        const savedUser = await validUser.save();
        // Object Id should be defined when successfully saved to MongoDB.
        expect(savedUser._id).toBeDefined();
        expect(savedUser.name).toBe(userData.name);
        expect(savedUser.email).toBe(userData.email);
        expect(savedUser.password).toBe(userData.password);
    });


    it('insert user successfully, but the field does not defined in schema should be undefined', async () => {
        const userWithInvalidField = new User({ name: 'testUnit', email: 'testx@tesx.com', password: '1234', nickname: 'nickname' });
        const savedUserWithInvalidField = await userWithInvalidField.save();
        expect(savedUserWithInvalidField._id).toBeDefined();
        expect(savedUserWithInvalidField.nickkname).toBeUndefined();
    });

    it('create user without required field should failed', async () => {
        const userWithoutRequiredField = new User({ name: 'nickname' });
        let err;
        try {
            const savedUserWithoutRequiredField = await userWithoutRequiredField.save();
            error = savedUserWithoutRequiredField;
        } catch (error) {
            err = error
        }
        expect(err).toBeInstanceOf(mongoose.Error.ValidationError)
        expect(err.errors.email).toBeDefined();
    });

})
