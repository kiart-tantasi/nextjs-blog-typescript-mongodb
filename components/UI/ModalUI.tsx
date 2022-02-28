import { Button } from "@mui/material";
import { useRef } from "react";
import styles from "./ModalUI.module.css";

const ModalUI = (props:{text: string; onConfirm: () => void; onClose: () => void; important?: boolean; delete?:{delete: boolean; slug:string;}}) => {
    const slugInputRef = useRef<HTMLInputElement>(null);

    const handleConfirm = () => {
        if (props.delete?.delete && props.delete?.slug !== slugInputRef.current?.value) {
            alert("slug ไม่ถูกต้อง");
            return;
        }
        props.onConfirm();
    }

    return (
        <>
        <div onClick={() => props.onClose()} className={styles.modalBackdrop} />
        <div className={styles.modal}>
            <div className={styles["modal-content"]}>
                <p>{props.text}</p>
                {props.delete?.delete &&
                <div>
                    <br />
                    <input type="text" ref={slugInputRef} />
                </div>}
            </div>
            <div className={styles.buttons}>
                <Button onClick={props.onClose}>ยกเลิก</Button>
                <Button color={props.important? "error": "success"} onClick={handleConfirm}>ยืนยัน</Button>
            </div>
        </div>
        </>
    )
}

export default ModalUI;