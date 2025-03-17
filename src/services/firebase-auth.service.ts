import { auth, db } from "@config/firebase"
import { UserRole } from "@sharedTypes/enums"
import { User } from "@sharedTypes/user"
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  UserCredential,
} from "firebase/auth"
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore"

export interface RegisterData {
  email: string
  password: string
  fullName: string
  username: string
  phoneNumber?: string
  company?: {
    name: string
    position: string
    department?: string
  }
}

export interface LoginData {
  email: string
  password: string
}

export const firebaseAuthService = {
  async register(data: RegisterData): Promise<UserCredential> {
    const { email, password, fullName, username, phoneNumber, company } = data
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    )

    const now = new Date().toISOString()
    const userData: Omit<User, "id"> = {
      email,
      fullName,
      username,
      role: UserRole.USER,
      permissions: [],
      createdAt: now,
      updatedAt: now,
      isActive: true,
      ...(phoneNumber && { phoneNumber }),
      ...(company && { company }),
      settings: {
        theme: "light",
        language: "tr",
        notifications: true,
      },
    }

    // Kullanıcı bilgilerini Firestore'a kaydet
    await setDoc(doc(db, "users", userCredential.user.uid), userData)

    return userCredential
  },

  async login(data: LoginData): Promise<UserCredential> {
    const { email, password } = data
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    )

    // Son giriş zamanını güncelle
    await updateDoc(doc(db, "users", userCredential.user.uid), {
      lastLoginAt: new Date().toISOString(),
    })

    return userCredential
  },

  async logout(): Promise<void> {
    return signOut(auth)
  },

  async getUserData(userId: string): Promise<User | null> {
    const userDoc = await getDoc(doc(db, "users", userId))
    if (!userDoc.exists()) return null

    return {
      id: userDoc.id,
      ...userDoc.data(),
    } as User
  },

  async updateUserData(userId: string, data: Partial<User>): Promise<void> {
    await updateDoc(doc(db, "users", userId), {
      ...data,
      updatedAt: new Date().toISOString(),
    })
  },
}
