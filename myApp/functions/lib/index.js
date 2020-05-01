"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const functions = require("firebase-functions");
const admin = require("firebase-admin");
// const cors = require('cors');
const cors = require('cors')({ origin: true });
admin.initializeApp();
// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });
exports.getFeed = functions.https.onCall(async(req, res) => {
    res.set('Access-Control-Allow-Origin', '*');
    cors(req, res, () => {
        const docs = await admin.firestore().collection('posts').limit(10).get();
        return docs.docs.map(doc => doc.data());
    });
    // const docs = await admin.firestore().collection('posts').limit(10).get();
    // res.send(docs.docs.map(doc => doc.data()));
});
// exports.test = functions.https.onRequest(async(req, res) => {
//     cors(req, res, () => {
//         res.set('Access-Control-Allow-Origin', '*');
//         const docs = await admin.firestore().collection('posts').limit(10).get();
//         res.send(docs.docs.map(doc => doc.data()));
//     });
// });
//# sourceMappingURL=index.js.map
// exports.subscribeToTopic = functions.https.onCall( async (data, context) => {
//     await admin.messaging().subscribeToTopic(data, token, data.topic)
//     return `subscribed to ${data.topic}`
// }
// );
// exports.subscribeFromTopic = functions.https.onCall( async (data, context) => {
//     await admin.messaging().subscribeFromTopic(data, token, data.topic)
//     return `subscribed to ${data.topic}`
// }
// );
// exports.sendOnFirestoreCreate = functions.firestore
//     .document('discounts/{discountID}')
//     .onCreate(async snapshot => {
//         const discount = snapshot.data()

//         const notification: admin.messaging.Notification = {
//             title: 'New Discount Available'
//             body: discount.headline
//         }

//         const payload: admin.messaging.Message = {
//             notification
//         }

//         return admin.messaging().send(payload)
//     })