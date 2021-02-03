const { Schema, model } = require('mongoose');

const HospitalSchema = Schema({
    nombre: {
        type: String,
        requred: true
    },
    img: {
        type: String
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    }
}, { collection: 'hospitales' });

HospitalSchema.method('toJSON', function() {
    const { __version, ...object } = this.toObject();
    return object;
});

module.exports = model('Hospital', HospitalSchema);