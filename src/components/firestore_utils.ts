import { DocumentReference } from '@firebase/firestore-types';
import { db } from '../index';
import firebase from "firebase/app";

/* Add feedback */
export const AddFeedback = (feedback: string, type: string) => {
    db.collection("feedback").add({
        feedback: feedback,
        type: type,
        created: firebase.database.ServerValue.TIMESTAMP
    })
    // .then((docRef: DocumentReference) => {
    //     console.log("Document written with ID: ", docRef.id);
    // })
    .catch((error: Error) => {
        console.error("Error adding document: ", error);
    });
}

export const AddGoodMatch = (query: string, restaurant_name: string, address: string) => {
    db.collection("query-match").add({
        query: query,
        restaurant_name: restaurant_name,
        address: address
    })
    // .then((docRef: DocumentReference) => {
    //     console.log("Document written with ID: ", docRef.id);
    // })
    .catch((error: Error) => {
        console.error("Error adding document: ", error);
    });
}

export const AddQuery = (query: string, 
                        postal: string, 
                        topk: number,
                        querytype: string,
                        region: string) => {
    db.collection("queries").add({
        query: query, 
        postal: postal, 
        topk: topk,
        querytype: querytype,
        region: region,
        created: firebase.database.ServerValue.TIMESTAMP
    })
    // .then((docRef: DocumentReference) => {
    //     console.log("Document written with ID: ", docRef.id);
    // })
    .catch((error: Error) => {
        console.error("Error adding document: ", error);
    });
}

export const AddComment = ( restaurant_name: string,
                            address: string,
                            comment: string,
                            rating: number,
                            ) => {
    // Get address
    restaurant_name = restaurant_name.replace(/[^a-zA-Z0-9 \n\.]/g, '').toLowerCase().replaceAll(' ','_'); 
    let postal_code = address.match(/Singapore [0-9]{6,6}/);
    let unit = address.match(/#[0-9\-]+/);
    if (postal_code === null || unit === null){
        return;
    } 
    let postal = postal_code[0].split(" ")[1]
    let unit_number = unit[0]
    let restaurant_key: string = `${restaurant_name}_${postal}_${unit_number}`;
    const restRef = db.collection('restaurants').doc(restaurant_key);
    restRef.collection('comments').add({
                        review: comment,
                        rating: rating,
                        created: firebase.firestore.FieldValue.serverTimestamp()
                    })
                    .then((docRef: DocumentReference) => {
                        console.log("Document written with ID: ", docRef.id);
                    })
                    .catch((error: Error) => {
                        console.error("Error adding document: ", error);
                    });
}
