// Import FirebaseAuth and firebase.
import React, { useEffect, useState } from 'react';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import firebase from 'firebase';
import { Button, Modal, ModalHeader, ModalBody } from 'reactstrap';

// Configure FirebaseUI.
const uiConfig = {
  // Popup signin flow rather than redirect flow.
  signInFlow: 'popup',
  // We will display Google and Facebook as auth providers.
  signInOptions: [
    firebase.auth.GoogleAuthProvider.PROVIDER_ID
  ],
  callbacks: {
    // Avoid redirects after sign-in.
    signInSuccessWithAuthResult: () => false,
  },
};

function SignInScreen() {
    const [isSignedIn, setIsSignedIn] = useState(false); // Local signed-in state.
    const [signInModalOpen, setSignInModalOpen] = useState(false);
    const toggleSignInModal = () => {
        setSignInModalOpen(!signInModalOpen);
    }

    // Listen to the Firebase Auth state and set the local state.
    useEffect(() => {
        const unregisterAuthObserver = firebase.auth().onAuthStateChanged(user => {
            setIsSignedIn(!!user);
        });
        return () => unregisterAuthObserver(); // Make sure we un-register Firebase observers when the component unmounts.
    }, []);

    if (!isSignedIn) {
        return (
            <div>
                <Button onClick={() => toggleSignInModal()}>
                    Sign in
                </Button>
                <Modal isOpen={signInModalOpen} toggle={toggleSignInModal}
                    centered={true}>
                    <ModalHeader toggle={toggleSignInModal}>
                        Sign in with Google
                    </ModalHeader>
                    <ModalBody>
                        <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={firebase.auth()} />
                    </ModalBody>
                </ Modal>
            </div>
        );
    }
    const displayName = firebase.auth().currentUser?.displayName;
    return (
        <div>
            <span className="pr-1">Logged in as {displayName}</span>
            <Button onClick={() => firebase.auth().signOut()}>Sign-out</Button>
        </div>
    );
}

export default SignInScreen;
