import React from 'react';
import PaypalExpressBtn from 'react-paypal-express-checkout';

export default class Paypal extends React.Component {
    render() {
        const onSuccess = (payment) => {
            console.log("The payment was succeeded!", payment);
            this.props.onSuccess();
        
        }

        const onCancel = (data) => {
            console.log('The payment was cancelled!', data);
            this.props.transactionCanceled();
        }

        const onError = (err) => {
            console.log("Error!", err);
            this.props.transactionError();
        }

        let env = 'sandbox';
        let currency = 'USD';
        let total = this.props.toPay; 

        const client = {
            sandbox: 'AXiJMKTyzRY_67h43HxeIyyK_I-LnWT361jdFbYLlbyc4H6teWR6--5GK2oNqZCz19MEdUrsu_4lEZJx',
            production: 'YOUR-PRODUCTION-APP-ID',
        }
        return (
            <PaypalExpressBtn
                env={env}
                client={client}
                currency={currency}
                total={total}
                onError={onError}
                onSuccess={onSuccess}
                onCancel={onCancel}
                style={{ 
                    size:'large',
                    color:'blue',
                    shape: 'rect',
                    label: 'checkout'
                }}
                 />
        );
    }
}