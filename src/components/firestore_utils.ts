import { DocumentReference } from '@firebase/firestore-types';
import { db } from '../index';

/* Add feedback */
export const AddFeedback = (feedback: string, type: string) => {
    db.collection("feedback").add({
        feedback: feedback,
        type: type,
    })
    .then((docRef: DocumentReference) => {
        console.log("Document written with ID: ", docRef.id);
    })
    .catch((error: Error) => {
        console.error("Error adding document: ", error);
    });
}

export const AddGoodMatch = (query: string, restaurant_name: string, address: string) => {
    db.collection("query").add({
        query: query,
        restaurant_name: restaurant_name,
        address: address
    })
    .then((docRef: DocumentReference) => {
        console.log("Document written with ID: ", docRef.id);
    })
    .catch((error: Error) => {
        console.error("Error adding document: ", error);
    });
}