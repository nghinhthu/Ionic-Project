import { Injectable } from '@angular/core'
import { AngularFireAuth } from '@angular/fire/auth'
import { first } from 'rxjs/operators'
import { auth } from 'firebase/app'
import { AngularFirestore } from '@angular/fire/firestore'
import { Post } from './post'

interface user {
    userName: string;
    uid: string,
    displayName: string;
    // account: string
    // gender: string
    // profilePic: string
}

@Injectable()

export class UserService {


    authState: any = null

    private user: user

    constructor(private afAuth: AngularFireAuth, private afStore: AngularFirestore) {
        this.afAuth.authState.subscribe(data => this.authState = data)
    }

    get authenticated(): boolean {
        return this.authState !== null
    }

    get currentUserId(): string {
        return this.authenticated ? this.authState.uid : null
    }

    setUser(user: user) {
        this.user = user
    }

    getEmail(): string {
        return this.user.userName
    }

    getDisplayName(): string {
        return this.user.displayName
    }

    clearItem(){
        this.user = null
    }

    // getAccount(): string {
    //     return this.user.account
    // }

    // getAccount(): string {
    //     return this.user.account
    // }

    // getProfilePic(): string {
    //     return this.user.profilePic
    // }

    // getGender(): string {

    // }

    reAuth(userName: string, password: string) {
        return this.afAuth.auth.currentUser.reauthenticateWithCredential(auth.EmailAuthProvider.credential(userName + '@gmail.com', password))
    }

    updatePassword(newpassword: string) {
        return this.afAuth.auth.currentUser.updatePassword(newpassword)
    }

    updateEmail(newemail: string) {
        return this.afAuth.auth.currentUser.updateEmail(newemail + '@gmail.com')
    }

    async isAuthenticated() {
        if (this.user) {
            return true
        }

        const user = await this.afAuth.authState.pipe(first()).toPromise()

        if (user) {
            this.setUser({
                userName: user.email.split('@')[0],
                uid: user.uid,
                displayName: user.displayName
            })
            return true
        }
        return false
    }

    getUID(): string {
        // if(!this.user){
        //     if(this.afAuth.auth.currentUser){
        //         const user = this.afAuth.auth.currentUser
        //         this.setUser({
        //             userName: user.email.split('@')[0],
        //             uid: user.uid
        //         })
        //         return user.uid
        //     }
        //     else{
        //         throw new Error("User not logged in")
        //     }
        // }
        // return this.user.uid
        // return this.user.uid
        return this.authenticated ? this.authState.uid : null
    }

    resetPasswordInit(email: string) {
        return this.afAuth.auth.sendPasswordResetEmail(
            email,
            { url: 'https://ionic-project-e1801.firebaseapp.com/__/auth/action' });
    }

    resetPassword(email: string) {
        return this.afAuth.auth.sendPasswordResetEmail(email + '@gmail.com')
            .then(() => console.log('sent Password Reset Email!'))
            .catch((error) => console.log(error))
    }
}