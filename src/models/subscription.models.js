import mongoose, {Schema} from 'mongoose';

const subscriptionSchema = new Schema({
    subscriber: {
        type: Schema.Types.ObjectId, // ID of the user who is subscribing
        ref: 'User',
        required: true
    },
    chanel: {
        type: Schema.Types.ObjectId, // ID of the user who is being subscribed to
        ref: 'User',
        required: true
    },
    
}, {timestamps: true});

export const Subscription = mongoose.model('Subscription', subscriptionSchema);
