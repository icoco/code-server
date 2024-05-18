import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react'; 

import { Button, Modal, Form } from '../../bootstrap';
import { ThemeLabel, themes } from '../../themes';
import { VZCodeContext } from '../../VZCodeContext';
import { fonts } from '../../Fonts/fonts';
import './index.scss'; 

import { FolderList } from "./FolderList" 
import { openDoc } from "../../api/apiClient.js" 

const fontSizes = ['16px', '18px', '20px', '24px'];


const openDocumentById=(docId)=>{
  openDoc(docId);
}


export const FolderPicker = ({
  enableUsernameField = true,
}: {
  // Feature flag to enable/disable username field
  enableUsernameField?: boolean;
}) => {
  const {
  
    isFoldersOpen,
    closeFolders,
    theme,
    setTheme,
    username,
    setUsername,
  } = useContext(VZCodeContext);

  const handleThemeChange = useCallback(
    (event: React.ChangeEvent<HTMLSelectElement>) => {
      setTheme(event.target.value as ThemeLabel);
    },
    [],
  );

  // Initialize font and size from localStorage or defaults
  // const [selectedFont, setSelectedFont] = useState(
  //   localStorage.getItem('vzcodeSelectedFont') ||
  //     'Roboto Mono',
  // );
  // const [selectedFontSize, setSelectedFontSize] = useState(
  //   localStorage.getItem('vzcodeSelectedFontSize') ||
  //     '16px',
  // );
  const [selectedFont, setSelectedFont] =
    useState('Roboto Mono');
  const [selectedFontSize, setSelectedFontSize] =
    useState('16px');

  useEffect(() => {
    // If we're in the browser,
    if (typeof window !== 'undefined') {
      const selectedFontFromLocalStorage: string | null =
        window.localStorage.getItem('vzcodeSelectedFont');

      const selectedFontSizeFromLocalStorage:
        | string
        | null = window.localStorage.getItem(
        'vzcodeSelectedFontSize',
      );

      if (selectedFontFromLocalStorage !== null) {
        setSelectedFont(selectedFontFromLocalStorage);
      }
      if (selectedFontSizeFromLocalStorage !== null) {
        setSelectedFontSize(
          selectedFontSizeFromLocalStorage,
        );
      }
    } else {
      // If we're not in the browser, use the default initial width.
    }
  }, []);

  // Called when the user selects a different font
  const handleFontChange = useCallback(
    (event: React.ChangeEvent<HTMLSelectElement>) => {
      const newFont = event.target.value;
      localStorage.setItem('vzcodeSelectedFont', newFont);
      setSelectedFont(newFont);
    },
    [],
  );

  // Called when the user selects a different font size
  const handleFontSizeChange = useCallback(
    (event: React.ChangeEvent<HTMLSelectElement>) => {
      const newSize = event.target.value;
      localStorage.setItem(
        'vzcodeSelectedFontSize',
        newSize,
      );
      setSelectedFontSize(newSize);
    },
    [],
  );

  useEffect(() => {
    document.body.style.setProperty(
      '--vzcode-font-family',
      selectedFont,
    );
  }, [selectedFont]);

  useEffect(() => {
    document.body.style.setProperty(
      '--vzcode-font-size',
      selectedFontSize,
    );
  }, [selectedFontSize]);

  const usernameRef = useRef<HTMLInputElement>(null);

  const handleUsernameChange = useCallback(() => {
    setUsername(usernameRef.current?.value || '');
  }, [setUsername]);

  // Function to handle pressing Enter key
  useEffect(() => {
    if (isFoldersOpen) {
      const handleEnterKey = (event: KeyboardEvent) => {
        if (event.key === 'Enter') {
          closeFolders();
        }
      };

      window.addEventListener('keydown', handleEnterKey);
      return () => {
        window.removeEventListener(
          'keydown',
          handleEnterKey,
        );
      };
    }
  }, [isFoldersOpen, closeFolders]);

  const folders = [];

  const onPickRow =(rowData)=>{
    closeFolders();
    const docId = rowData.id;
    openDocumentById(docId);
  }
  const width =45

  return isFoldersOpen ? (
    <Modal
     
      show={isFoldersOpen}
      onHide={closeFolders}
      animation={false}
    
    >
      <Modal.Header closeButton>
        <Modal.Title>🗂️ Folders</Modal.Title>
      </Modal.Header>
      <Modal.Body > 
        <FolderList items={folders} onPickRow={onPickRow} isDoc={false} />
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={closeFolders}>
          Done
        </Button>
      </Modal.Footer>
    </Modal>
  ) : null;
};
