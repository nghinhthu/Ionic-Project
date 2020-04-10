import { Injectable } from '@angular/core'
import { AngularFireAuth } from '@angular/fire/auth'
import { first, map, switchMap } from 'rxjs/operators'
import { auth } from 'firebase/app'
import { AngularFirestore } from '@angular/fire/firestore'
import { combineLatest, defer } from 'rxjs'

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