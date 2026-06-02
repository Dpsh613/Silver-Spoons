import mongoose from 'mongoose';

const qaSchema = new mongoose.Schema({
    question: { type: String, required: true },
    answer: { type: String, required: true },
});

const settingsSchema = new mongoose.Schema(
    {
        restaurantName: { type: String, required: true, default: 'My Restaurant' },
        address: { type: String, required: true, default: '123 Main St' },
        phone: { type: String, required: true, default: '123-456-7890' },
        hours: {
            type: Map,
            of: String, // e.g., { "Monday": "9am - 10pm", "Tuesday": "Closed" }
            default: { Monday: '9am - 5pm' },
        },
        chatbotQA: [qaSchema], // Array of questions and answers
    },
    { timestamps: true }
);

export default mongoose.model('Settings', settingsSchema);