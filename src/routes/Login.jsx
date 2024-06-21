import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { Button } from '../components/ui/button';
import { auth, db, firebaseDatabase } from '../firebase/db';
import { useStore } from '../store/userStore';
import { Navigate } from 'react-router-dom';
import { ref, set } from 'firebase/database';
import { collection, doc, setDoc } from 'firebase/firestore';

const provider = new GoogleAuthProvider();

export default function Login() {
  const login = useStore((s) => s.userLogin);
  const isLoggedIn = useStore((s) => s.isLoggedIn);

  const handleClick = () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        // The signed-in user info.
        const user = result.user;

        const userRef = collection(db, 'users');

        setDoc(
          doc(userRef, user.uid),
          {
            displayName: user.displayName,
            email: user.email,
          },
          {
            merge: true,
          }
        );

        // set(ref(firebaseDatabase, `user/${user.uid}`), {
        //   displayName: user.displayName,
        // });
        login(user);
      })
      .catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorMessage);
        // The email of the user's account used.
        // const email = error.customData.email;
        // The AuthCredential type that was used.
        // const credential = GoogleAuthProvider.credentialFromError(error);
        // ...
      });
  };

  return (
    <section className="flex items-center contaner justify-center ">
      <Button onClick={handleClick}>Login with Google</Button>
      {isLoggedIn && <Navigate to="/" replace />}
    </section>
  );
}
