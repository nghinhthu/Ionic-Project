import { Injectable } from '@angular/core'
import { AngularFireAuth } from '@angular/fire/auth'
import { map, filter, switchMap } from 'rxjs/operators';
import { auth } from 'firebase/app'
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore'
import { Post } from './post'
import { Observable } from 'rxjs';
import 'rxjs/Rx';


@Injectable()
export class PostService {
  postsCollection: AngularFirestoreCollection<Post>
  postDoc: AngularFirestoreDocument<Post>

  constructor(private afs: AngularFirestore) {
    this.postsCollection = this.afs.collection('posts', ref =>
      ref.orderBy('published', 'desc')
    )
  }

  getPosts() {
    return this.postsCollection.snapshotChanges().map(actions => {
      return actions.map(a => {
        const data = a.payload.doc.data() as Post
        const id = a.payload.doc.id
        return { id, ...data }
      })
    })
  }

  getPostData(id: string) {
    this.postDoc = this.afs.doc<Post>(`posts/${id}`)
    return this.postDoc.valueChanges()
  }

  getPost(id: string) {
    return this.afs.doc<Post>(`posts/${id}`)
  }

  create(data: Post) {
    this.postsCollection.add(data)
  }

  delete(id: string) {
    return this.getPost(id).delete()
  }

  update(id: string, formData) {
    return this.getPost(id).update(formData)
  }
}

// interface post{
//     author: string;
//     uid: string, 
//     like: number
// }
// @Injectable()

// export const PostService = (
//     afs: AngularFirestore,
//     paths: { [key: string]: string}
// ) => {
//     return source =>
//         defer(() => {
//             let parent;
//             const keys = Object.keys(paths);

//             return source.pipe(
//                 switchMap(data => {
//                     parent = data;

//                     const doc$ = key.map(k => {
//                         const fullPath = `${paths[k]}/${parent[k]}`;
//                         return afs.doc(fullPath).valueChanges();
//                     });

//                     return combineLatest(doc$);
//                 }),
//                 map(arr => {
//                     const joins = keys.reduce((acc, cur, idx) => {
//                         return { ...acc, [cur]: arr[idx] }
//                     }, {});

//                     return { ...parent, ...joins }
//                 })
//             )
//         })
// }