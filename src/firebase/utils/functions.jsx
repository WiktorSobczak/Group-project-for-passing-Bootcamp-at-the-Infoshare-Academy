import { auth, db, provider } from "../firebase"
import { signInWithPopup, signOut } from 'firebase/auth'
import { addDoc, collection, deleteDoc, doc, getDocs, onSnapshot, updateDoc, query, where } from "firebase/firestore";

export const usersCollection = collection(db, "Users");
export const locationsCollection = collection(db, "Locations");

provider.setCustomParameters(
  {prompt: 'select_account'}
)

export const signInWithGoogle = async () => {
  const result = await signInWithPopup(auth, provider)
  return result
}

export const getUsers =  () => {
  return getDocs(query(usersCollection,  where("isAdmin", "==", false)))
}

export const getUsersByLocation =  (id) => {
  return getDocs(query(usersCollection,  where("location_id", "==", id)))
}

export const getUsersWithoutLocation =  (id) => {
  return getDocs(query(usersCollection,  where("location_id", "==", "")))
}

export const getUsersByEmail = (email) => {
  return email ? getDocs(query(usersCollection, where("e-mail", "==", email))) : null
}

export const addUser = (user) => {
  addDoc(usersCollection, user)
}

export const dellUser = (id) => {
  deleteDoc(doc(db, "Users", id))
}

export const getLocations =  () => {
  return getDocs(locationsCollection)
}

export const addLocationFunction = (location) => {
  addDoc(locationsCollection, location)
}

export const getLocationsByName = async (name) => {
  const p = await getDocs(query(locationsCollection, where("name", "==", name)))
  return p
}

export const dellLocationFunction = (id) => {
  deleteDoc(doc(db, "Locations", id))
  getDocs(query(usersCollection, where("location_id", "==", id))).then(querySnapshot => {
    querySnapshot.forEach(doc => deleteDoc(doc))
  })
}

export const editLocationFunction =  (id, newName) =>  {
  getDocs(query(locationsCollection, where("name","==",newName))).then(querySnapshot => {
    if (querySnapshot.empty) updateDoc(doc(db, "Locations", id), {
      name: newName
    });
  })
    
}