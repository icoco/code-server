import { useEffect, useState } from 'react';
import { randomId } from '../../randomId';
import { ShareDBDoc, VZCodeContent } from '../../types';
import { useSubmitOperation } from '../useSubmitOperation';
import { Request }  from "../utils/Request.js";

// get the docId from the current url request paramter 
export const getRequestDocId = function(){
  const args = Request.getParameters();
  const docId = args['docId'];
 
  return docId ? docId : 'homeSpace';
}

// Set up the connection to ShareDB.
export const useShareDB = ({
  connection,
}: {
  connection: any;
}) => {
  // The ShareDB document.
  const [shareDBDoc, setShareDBDoc] =
    useState<ShareDBDoc<VZCodeContent> | null>(null);

  // Local ShareDB presence, for broadcasting our cursor position
  // so other clients can see it.
  // See https://share.github.io/sharedb/api/local-presence
  const [localPresence, setLocalPresence] = useState(null);

  // The document-level presence object, which emits
  // changes in remote presence.
  const [docPresence, setDocPresence] = useState(null);

  // The `doc.data` part of the ShareDB document,
  // updated on each change to decouple rendering from ShareDB.
  // Starts out as `null` until the document is loaded.
  const [content, setContent] =
    useState<VZCodeContent | null>(null);

  const [connected, setConnected] =
    useState<boolean>(false);

  const [documentId, setDocumentId]= useState<String | null>(null);

  useEffect(() => {
    // Listen for connection state changes
    connection.on('connected', () => {
      setConnected(true);
    });

    connection.on('disconnected', () => {
      setConnected(false);
    });

    // Since there is only ever a single document,
    // these things are pretty arbitrary.
    //  * `collection` - the ShareDB collection to use
    //  * `id` - the id of the ShareDB document to use
    const collection = 'documents';
    const id = getRequestDocId();
    
    // Initialize the ShareDB document.
    const shareDBDoc = connection.get(collection, id);

    setDocumentId(id);
    
    // Subscribe to the document to get updates.
    // This callback gets called once only.
    shareDBDoc.subscribe(() => {
      // Expose ShareDB doc to downstream logic.
      setShareDBDoc(shareDBDoc);

      // Set initial data.
      setContent(shareDBDoc.data);

      // Listen for all changes and update `data`.
      // This decouples rendering logic from ShareDB.
      // This callback gets called on each change.
      shareDBDoc.on('op', () => {
        // TODO consider excluding file contents from this,
        // because currently we are re-rendering the entire
        // document on each file change (each keystroke while editing).
        // This is not required, because no part of the app outside
        // of the CodeMirror integration uses those file contents.
        // The Sidebar only needs to know file names, not contents.
        setContent(shareDBDoc.data);
      });

      // Set up presence.
      // See https://github.com/share/sharedb/blob/master/examples/rich-text-presence/client.js#L53
      const docPresence = connection.getDocPresence(
        collection,
        id,
      );

      // Subscribe to receive remote presence updates.
      docPresence.subscribe(function (error) {
        if (error) throw error;
      });

      // Set up our local presence for broadcasting this client's presence.
      const generateTimestampedId = () => {
        const timestamp = Date.now().toString(36);
        const randomPart = randomId();
        return `${timestamp}-${randomPart}`;
      };
      setLocalPresence(
        docPresence.create(generateTimestampedId()),
      );

      // Store docPresence so child components can listen for changes.
      setDocPresence(docPresence);
    });

    // TODO unsubscribe from presence
    // TODO unsubscribe from doc
    return () => {
      // shareDBDoc.destroy();
      // docPresence.destroy();
    };
  }, []);

  // A convenience function for mutating the ShareDB document
  // based submitting OT ops generated by diffing the JSON.
  const submitOperation =
    useSubmitOperation<VZCodeContent>(shareDBDoc);

  return {
    shareDBDoc,
    content,
    localPresence,
    docPresence,
    submitOperation,
    connected,
    documentId,
  };
};
