import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin'

admin.initializeApp()

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

export const getFeed = functions.https.onCall(async(req, res) => {
    const docs = await admin.firestore().collection('posts').limit(10).get()
    return docs.docs.map(doc => doc.data())
})

