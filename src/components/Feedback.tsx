import React from 'react'


const Feedback = ({ visible, switchModal }: any) => {
    const [message, setMessage] = React.useState<string>("");

    const onSubmit = (): void => {


        switchModal(false);
    }

    const onClose = (): void => {
        switchModal(false);
    }

    return ( <div></div>
        // <Modal
        //     visible={visible}
        //     onOk={onSubmit}
        //     onCancel={onClose}
        //     footer={[
        //         <Button className="button" type="ghost" onClick={onClose}>Cancel</Button>,
        //         <Button className="button" type="ghost" onClick={onSubmit}>Submit</Button>
        //     ]}
        // >
        //     Hello
        // </Modal>
    )
}

export default Feedback;