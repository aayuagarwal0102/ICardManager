const mongoose = require('mongoose');

const IdCardDesignSchema = new mongoose.Schema({
    schoolId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'School', 
        required: true 
    },
    designName: { 
        type: String, 
        required: true,
        default: 'Default Design'
    },
    template: { 
        type: String, 
        required: true,
        default: 'template2'
    },
    fields: [{
        label: { type: String, required: true },
        key: { type: String, required: true },
        position: {
            left: { type: String, default: '10px' },
            top: { type: String, default: '10px' }
        },
        fontSize: { type: Number, default: 10 },
        textColor: { type: String, default: '#222222' },
        fontWeight: { type: String, default: 'normal' }
    }],
    styling: {
        backgroundColor: { type: String, default: '#ffffff' },
        fontFamily: { type: String, default: 'Arial' },
        fontSize: { type: Number, default: 7 },
        fieldTextColor: { type: String, default: '#222222' },
        backgroundImage: { type: String, default: null }
    },
    photoSettings: {
        position: {
            left: { type: Number, default: 0 },
            top: { type: Number, default: 0 }
        },
        size: {
            width: { type: Number, default: 2.5 },
            height: { type: Number, default: 3.2 }
        }
    },
    isDefault: { 
        type: Boolean, 
        default: false 
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    },
    updatedAt: { 
        type: Date, 
        default: Date.now 
    }
});

// Update the updatedAt field before saving
IdCardDesignSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('IdCardDesign', IdCardDesignSchema); 