import { useCallback, useContext, useMemo,Suspense } from 'react';
import path from "path";

import {
  FileId,
  FileTree, 
  FileTreeFile,
} from '../../types';
import { Tooltip, OverlayTrigger } from '../bootstrap';
import { getFileTree } from '../getFileTree';
import { sortFileTree } from '../sortFileTree';
import { SplitPaneResizeContext } from '../SplitPaneResizeContext';
import {
  BugSVG,
  GearSVG,
  NewSVG,
  FileSVG,
  QuestionMarkSVG,
} from '../Icons';
import { VZCodeContext } from '../VZCodeContext';
import { Listing } from './Listing';
import { useDragAndDrop } from './useDragAndDrop';
import './styles.scss';
import { backgroundColor } from '../themes/vizhubTheme/colors';

import  React  from 'react';
import { FolderBar,docHandler } from "../Components/FolderBar";
import { Tooltip as MyToolTip } from 'react-tooltip' 
import { isFocusFile } from "../api/runtimeOption.js"
import { loopFiles } from "./indexHelper.js"
 

// TODO turn this UI back on when we are actually detecting
// the connection status.
// See https://github.com/vizhub-core/vzcode/issues/456
const enableConnectionStatus = true;

export const VZSidebar = ({
  createFileTooltipText = 'New File🚀',
  createDirTooltipText = 'New Directory',
  openSettingsTooltipText = 'Open Settings',
  openKeyboardShortcuts = 'Keyboard Shortcuts',
  reportBugTooltipText = 'Report Bug',
}: {
  createFileTooltipText?: string;
  createDirTooltipText?: string;
  openSettingsTooltipText?: string;
  reportBugTooltipText?: string;
  openKeyboardShortcuts?: string;
}) => {
  const {
    spaceName,
    files,
    openTab,
    setIsSettingsOpen,
    setIsFoldersOpen,
    setIsDocOpen,
    handleOpenCreateFileModal,
    handleOpenCreateDirModal,
    connected,
    documentId,
  } = useContext(VZCodeContext);

  const fileTree_keep = useMemo(
    () => (files ? sortFileTree(getFileTree(files)) : null),
    [files],
  );
  
  const fileTree = useMemo(
    () =>{
      if (files){
          return sortFileTree(getFileTree(files))
      }
      return null; 
    },
    [files],
  );
  //--------- begin 
  //use check mount status to avoid repeat execute mount event logic 
  const mountedOnce = React.useRef<boolean>(false); 

  const onMountedOnce = ()=>{
    if (mountedOnce.current) {
       return ;
    } 
    if (!files) return ;
    mountedOnce.current = true;

    setTimeout(()=>{ 
      openFocusFile(files);
    },100) 
  } 

  const openFocusFile = async (files)=>{ 
    /*
      files is a object not array
      files =
        { 
          x:{
            name:
            text:
          }
          ...
        }  
    */
    loopFiles(files,(x)=>{
      /*
        item = {
          name ,
          file,
          fileId,
          paths
        }
      */
     // console.log(`->onFileItem, filter root file?`,x)
      const isRootFile = x.paths.length === 1
      if (!isRootFile){
        return ;
      }
      //only handle root file 
      if (isFocusFile(x.name)){
        setTimeout(()=>{
          const fileId = x.fileId;
          openTab({ fileId, isTransient: true });
        }, 100)
        // break loop immediately 
        return true;
      } 
    }) 
  } 
 
  console.log('🧐 try onMountedOnce');
  onMountedOnce();
  //----- end 

  const handleQuestionMarkClick = useCallback(() => {
    setIsDocOpen(true);
  }, []);
  const handleSettingsClick = useCallback(() => {
    setIsSettingsOpen(true);
  }, []);

  const { sidebarWidth } = useContext(
    SplitPaneResizeContext,
  );

  // On single-click, open the file in a transient tab.
  const handleFileClick = useCallback(
    (fileId: FileId) => {
      openTab({ fileId, isTransient: true });
    },
    [openTab],
  );

  // On double-click, open the file in a persistent tab.
  const handleFileDoubleClick = useCallback(
    (fileId: FileId) => {
      openTab({ fileId, isTransient: false });
    },
    [openTab],
  );

  // True if files exist.
  const filesExist =
    fileTree &&
    fileTree.children &&
    fileTree.children.length > 0;

  const {
    isDragOver,
    handleDragEnter,
    handleDragOver,
    handleDragLeave,
    handleDrop,
  } = useDragAndDrop();

  //avoid repeat fetch ?!
  docHandler.getDocInfoById(documentId);
  const fetchDocumentBar = function(documentId){  
    return (
      <Suspense fallback={<span className='folder-loading'>loading...</span>}>
        <FolderBar documentId={documentId} rowData={undefined} onPickRow={undefined} children={undefined}> 
        </FolderBar>
      </Suspense>
    )
  }

  // 
  const handleFoldersClick = useCallback(() => {
    //setIsSettingsOpen(true);
    setIsFoldersOpen(true);
  }, []);

  return (
    <div
      className="vz-sidebar"
      style={{ width: sidebarWidth + 'px' }}
      onDragEnter={handleDragEnter}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="files">
        <div className="full-box">
          <div className="sidebar-section-hint folder" onClick={handleFoldersClick} data-tooltip-id="my-tooltip" data-tooltip-content="Folders">🗂️</div>
          <MyToolTip id="my-tooltip" ></MyToolTip>
          <div className="sidebar-section-buttons">
            {/* <OverlayTrigger
              placement="right"
              overlay={
                <Tooltip id="open-keyboard-shortcuts">
                  {openKeyboardShortcuts}
                </Tooltip>
              }
            >
              <i
                onClick={handleQuestionMarkClick}
                className="icon-button icon-button-dark"
              >
                <QuestionMarkSVG />
              </i>
            </OverlayTrigger> */}

            {/* <OverlayTrigger
              placement="right"
              overlay={
                <Tooltip id="report-bug-tooltip">
                  {reportBugTooltipText}
                </Tooltip>
              }
            >
              <a
                href="https://github.com/vizhub-core/vzcode/issues/new"
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="icon-button icon-button-dark">
                  <BugSVG />
                </i>
              </a>
            </OverlayTrigger> */}

            {/* <OverlayTrigger
              placement="left"
              overlay={
                <Tooltip id="open-settings-tooltip">
                  {openSettingsTooltipText}
                </Tooltip>
              }
            >
              <i
                onClick={handleSettingsClick}
                className="icon-button icon-button-dark"
              >
                <GearSVG />
              </i>
            </OverlayTrigger> */}

            <OverlayTrigger
              placement="left"
              overlay={
                <Tooltip id="create-file-tooltip">
                  {createFileTooltipText}
                </Tooltip>
              }
            >
              <i
                onClick={handleOpenCreateFileModal}
                className="icon-button icon-button-dark"
              >
                <NewSVG />
              </i>
            </OverlayTrigger>

            {/*Directory Rename*/}
            <OverlayTrigger
              placement="left"
              overlay={
                <Tooltip id="create-dir-tooltip">
                  {createDirTooltipText}
                </Tooltip>
              }
            >
              <i
                onClick={handleOpenCreateDirModal}
                className="icon-button icon-button-dark"
              >
                <FileSVG />
              </i>
            </OverlayTrigger>
          </div>
        </div>
        {documentId ? 
          ( 
            fetchDocumentBar(documentId)
          )
          :(<div>?</div>)
        } 
        
        {isDragOver ? (
          <div className="empty">
            <div className="empty-text">
              Drop files here!
            </div>
          </div>
        ) : filesExist ? (
          fileTree.children.map((entity) => {
            const { fileId } = entity as FileTreeFile;
            const { path } = entity as FileTree;
            const key = fileId ? fileId : path;
            return (
              <Listing
                key={key}
                entity={entity}
                handleFileClick={handleFileClick}
                handleFileDoubleClick={
                  handleFileDoubleClick
                }
              />
            );
          })
        ) : (
          <div className="empty">
            <div className="empty-text">
              It looks like you don't have any files yet!
              Click the "Create file" button above to create
              your first file.
            </div>
          </div>
        )}
      </div> 

      {enableConnectionStatus && (
        <div className="connection-status">
          {/* {connected ? 'Connected' : 'Connection Lost'} */}
          <div 
              className={`connection-status-indicator ${
                connected ? 'connected' : 'disconnected'
              }`}
            />  
          <div > 
            <OverlayTrigger
                  placement="left"
                  overlay={
                    <Tooltip id="open-settings-tooltip">
                      {openSettingsTooltipText}
                    </Tooltip>
                  }
                >
                  <i
                    onClick={handleSettingsClick}
                    className="icon-button icon-button-dark"
                  >
                    <GearSVG />
                  </i>
            </OverlayTrigger>
          </div>
        </div>
      )}
         
       
      </div>
    
  );
};
