import { useCallback, useContext, useState } from 'react';
import { PlaySVG } from '../Icons';
import { VZCodeContext } from '../VZCodeContext';
import { OverlayTrigger, Tooltip } from '../bootstrap';
import './style.scss';

export const SettingsWidget = ({
  settingsWidgetTooltipText = (
    <>
      <strong>Settings</strong>
      {/* <div>(Shift + Enter or Ctrl + s)</div> */}
    </>
  ),
}: {
  settingsWidgetTooltipText?: JSX.Element;
}) => {
  const { settingsRef, runPrettierRef } =
    useContext(VZCodeContext);
  const [isRunning, setIsRunning] = useState(false);

  const handleClick = useCallback(() => {
    setIsRunning(true); // Set the running state to true

    // Run Prettier
    const runPrettier = runPrettierRef.current;
    if (runPrettier !== null) {
      runPrettier();
    }

    // Run the code
    const settings = settingsRef.current;
    if (settings !== null) {
      settings();
    }

    // Optional: reset the icon state after animation completes (e.g., 1 second)
    setTimeout(() => setIsRunning(false), 1000);
  }, []);

  return (
    <div className="vz-code-settings-widget">
      <OverlayTrigger
        placement="left"
        overlay={
          <Tooltip id="settings-tooltip">
            {settingsWidgetTooltipText}
          </Tooltip>
        }
      >
        <i
          className={`icon-button icon-button-dark ${isRunning ? 'rotate-icon' : ''}`}
          onClick={handleClick}
        >
          <PlaySVG />
        </i>
      </OverlayTrigger>
    </div>
  );
};
