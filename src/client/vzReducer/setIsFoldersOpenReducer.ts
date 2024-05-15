import { VZAction, VZState } from '.';

export const setIsFoldersOpenReducer = (
  state: VZState,
  action: VZAction,
): VZState =>
  action.type === 'set_is_folders_open'
    ? { ...state, isFoldersOpen: action.value }
    : state;
