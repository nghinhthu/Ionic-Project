import { Injectable } from '@angular/core'
import { AngularFireAuth } from '@angular/fire/auth'
import { first } from 'rxjs/operators'
import { auth } from 'firebase/app'

interface user{
    userName: string;
    uid: string
}

@Injectable()

export class UserService {

    private user: user

    constructor(private afAuth: AngularFireAuth){

    }

    setUser(user: user){
        this.user = user
    }

    getUserName(): string{
        return this.user.userName
    }

    reAuth(userName: string, password: string) {
		return this.afAuth.auth.currentUser.reauthenticateWithCredential(auth.EmailAuthProvider.credential(userName + '@gmail.com', password))
	}

	updatePassword(newpassword: string) {
		return this.afAuth.auth.currentUser.updatePassword(newpassword)
	}

	updateEmail(newemail: string) {
		return this.afAuth.auth.currentUser.updateEmail(newemail + '@gmail.com')
	}

    async isAuthenticated(){
        if(this.user){
            return true
        }

        const user = await this.afAuth.authState.pipe(first()).toPromise()

        if(user){
            this.setUser({
                userName: user.email.split('@')[0],
                uid: user.uid
            })
            return true
        }
        return false
    }

    getUID(): string{
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
        return this.user.uid
    }
}