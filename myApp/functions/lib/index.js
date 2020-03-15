"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();
// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });
exports.getFeed = functions.https.onRequest(async (req, res) => {
    const docs = await admin.firestore().collection('posts').limit(10).get();
    res.send(docs.docs.map(doc => doc.data()));
});
//# sourceMappingURL=index.js.map