import { Injectable } from '@angular/core'
import { AngularFireAuth } from '@angular/fire/auth'
import { first } from 'rxjs/operators'
import { auth } from 'firebase/app'

interface post{
    author: string;
    uid: string, 
    like: number
}
@Injectable()

export class PostService {

    private post: post

    constructor(private afAuth: AngularFireAuth){

    }

    getUID(){
        return this.post.uid
    }
    
}