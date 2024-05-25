//import { generateAIResponse } from './generateAIResponse.js';
import { myLogger } from './myLogger.js';

const debug = false;

export const handleAIAssist =
  (shareDBDoc) => async (req, res) => {
    const { inputText, insertionCursor, fileId } = req.body;

    if (debug) {
      myLogger.debug('[handleAIAssist] inputText:', inputText);
      myLogger.debug(
        '[handleAIAssist] insertionCursor:',
        insertionCursor,
      );
      myLogger.debug('[handleAIAssist] fileId:', fileId);
    }

    try { //@@ ignore it 
      // await generateAIResponse({
      //   inputText,
      //   insertionCursor,
      //   fileId,
      //   shareDBDoc,
      // });

      res
        .status(200)
        .send({ message: 'Operation successful!' });
    } catch (error) {
      myLogger.debug('handleAIAssist error:', error);
      res.status(500).send({
        message: 'Internal Server Error',
        error: error.message,
      });
    }
  };

export function haltGeneration(streamId) {
  const stream = streams[streamId];

  // Stream can be undefined here if the user
  // clicks start and stop very quickly.
  if (stream) {
    stream.controller.abort();
  }
}
