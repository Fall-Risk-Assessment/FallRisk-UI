import { useEffect, useId, useRef } from 'react';
import './common.css';

export const Modal = ({
    isOpen,
    onClose,
    title,
    children,
    className = '',
    footer
}) => {
    const dialogRef = useRef(null);
    const titleId = useId();
    useEffect(() => {
        const dialog = dialogRef.current;
        if (isOpen && !dialog.open) dialog.showModal();
        if (!isOpen && dialog.open) dialog.close();
    }, [isOpen]);

    return (
        <dialog ref={dialogRef} className={`workspace-modal common-modal-content ${className}`} aria-labelledby={titleId} onCancel={onClose} onClick={(event) => { if (event.target === event.currentTarget) onClose(); }}>
            <div>
                <div className="common-modal-header">
                    <h3 className="common-modal-title" id={titleId}>{title}</h3>
                    <button className="common-modal-close" type="button" aria-label="Close dialog / ปิด" onClick={onClose}>&times;</button>
                </div>
                <div className="common-modal-body">
                    {children}
                </div>
                {footer && (
                    <div className="common-modal-footer">
                        {footer}
                    </div>
                )}
            </div>
        </dialog>
    );
};
