// FileId
//   * A unique ID for a file.

import { JSONOp } from 'ot-json1';

//   * This is a random string.
export type FileId = string;

// Files
//  * A collection of files.
//  * Keys are _not_ file names or array indices,
//    because based on past experience, that
//    leads to very difficult frontend logic around
//    OT in the case that a file is renamed or deleted.
//  * When the file name changes, or files are added/deleted,
//    this ID stays the same, simplifying things re:OT.
export interface Files {
  [fileId: FileId]: File;
}

// File
//  * A file with `name` and `text`.
export interface File {
  // The file name.
  // e.g. "index.html".
  name: string;

  // The text content of the file.
  // e.g. "<body>Hello</body>"
  text: string;
}

// FileTreePath
//  * The path to the directory, e.g. "src/components", OR
//  * The path to the file e.g. "src/components/HelloWorld.js".
export type FileTreePath = string;

// FileTree
//  * A tree of files.
//  * Each node in the tree is either a directory or a file.
//  * Each directory has a `children` array.
//  * Each file has a `file` object.
//  * Each file has a `fileId` string.
//  * Each directory has a `name` string.
//  * Each directory has a `path` string.
export interface FileTree {
  name: string;
  path?: FileTreePath;
  children?: Array<FileTree | FileTreeFile>;
}

// FileTreeFile
//  * A file in a file tree.
//  * Each file has a `name` string.
//  * Each file has a `file` object.
//  * Each file has a `fileId` string.
export interface FileTreeFile {
  name: string;
  file: File;
  fileId: FileId;
}

// `ShareDBDoc`
// A ShareDB Document.
// TODO better types? Integrate with upstream how?
// https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/sharedb/lib/sharedb.d.ts#L110
export type ShareDBDoc<T> = {
  data: T;
  ingestSnapshot: (snapshot: any, callback) => void;
  subscribe: (callback) => void;
  on: (
    event: string,
    callback: (op: JSONOp, source: boolean) => void,
  ) => void;
  off: (event: string, callback: () => void) => void;
  submitOp: (
    op: JSONOp,
    options?: any,
    callback?: () => void,
  ) => void;
};

// The ShareDB document type for VZCode.
export type VZCodeContent = {
  // `files`
  //   * The files in the VZCode instance.
  files: Files;

  // `isInteracting`
  //   * `true` when the user is interacting
  //     via interactive code widgets (e.g. Alt+drag)
  //     * Hot reloading is throttled when this is `true`.
  //   * `false` or `undefined` when they are not (e.g. normal typing)
  //     * Hot reloading is debounced when this is `false`.
  isInteracting?: boolean;
};

// An id used for presence.
export type PresenceId = string;

// A user name for display in presence.
export type Username = string;
