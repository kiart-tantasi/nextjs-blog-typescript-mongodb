import { Button } from "@mui/material";
import styles from "./ModalUI.module.css";

const ModalUI = (props:{text: string; onConfirm: () => void; onClose: () => void}) => {    

    return (
        <>
        <div onClick={() => props.onClose()} className={styles.modalBackdrop}>
        </div>
        <div className={styles.modal}>
            <div className={styles["modal-content"]}>
                <p>{props.text}</p>
            </div>
            <div className={styles.buttons}>
                <Button onClick={props.onClose}>ยกเลิก</Button>
                <Button color="success" onClick={props.onConfirm}>ยืนยัน</Button>
            </div>
        </div>
        </>
    )
}

export default ModalUI;