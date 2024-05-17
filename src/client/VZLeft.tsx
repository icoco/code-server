import { VZSettings } from './VZSettings';

import { FolderPicker } from './Components/FolderPicker';

import { VZKeyboardShortcutsDoc } from './VZKeyboardShortcutsDoc';
import { VZSidebar } from './VZSidebar';
import { CreateFileModal } from './VZSidebar/CreateFileModal';
import { CreateDirModal } from './VZSidebar/CreateDirModal';

// The middle portion of the VZCode environment, containing:
// * The sidebar
// * The settings modal
// * The create file modal
export const VZLeft = ({ enableUsernameField = true }) => {
  return (
    <div className="left">
      <VZSidebar />
      <VZSettings
        enableUsernameField={enableUsernameField}
      />
      <VZKeyboardShortcutsDoc
        enableUsernameField={enableUsernameField}
      />
      <FolderPicker
        enableUsernameField={enableUsernameField}
      />
      <CreateFileModal />
      <CreateDirModal />
    </div>
  );
};
