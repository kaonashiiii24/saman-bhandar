const crypto = require('crypto');
const axios = require('axios');

const ESEWA_SECRET = process.env.ESEWA_SECRET_KEY || '8gBm/:&EnhH.1/qe';
const ESEWA_PRODUCT_CODE = 'EPAYTEST';
const KHALTI_SECRET_KEY = process.env.KHALTI_SECRET_KEY || 'test_secret_key_f59e8b7d18b4499ca40f68195a846e9b';

const generateEsewaSignature = (amount, transactionUuid) => {
  const message = `total_amount=${amount},transaction_uuid=${transactionUuid},product_code=${ESEWA_PRODUCT_CODE}`;
  return crypto.createHmac('sha256', ESEWA_SECRET).update(message).digest('base64');
};

const verifyEsewaPayment = async (transactionUuid, totalAmount) => {
  try {
    const response = await axios.get(
      `https://rc-epay.esewa.com.np/api/epay/transaction/status/?product_code=${ESEWA_PRODUCT_CODE}&transaction_uuid=${transactionUuid}&total_amount=${totalAmount}`
    );
    if (response.data && response.data.status === 'COMPLETE') {
      return { success: true, data: response.data };
    }
    return { success: false };
  } catch (err) {
    return { success: false, error: err.message };
  }
};

const initiateKhaltiPayment = async (amount, orderId, orderName, customer) => {
  try {
    const response = await axios.post(
      'https://dev.khalti.com/api/v2/epayment/initiate/',
      {
        return_url: `${process.env.CLIENT_URL || 'http://localhost:5173'}/payment/success`,
        website_url: process.env.CLIENT_URL || 'http://localhost:5173',
        amount: Math.round(amount * 100),
        purchase_order_id: orderId,
        purchase_order_name: orderName,
        customer_info: customer
      },
      {
        headers: {
          Authorization: `Key ${KHALTI_SECRET_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );
    return { success: true, paymentUrl: response.data.payment_url, pidx: response.data.pidx };
  } catch (err) {
    return { success: false, error: err.response?.data || err.message };
  }
};

const verifyKhaltiPayment = async (pidx) => {
  try {
    const response = await axios.post(
      'https://dev.khalti.com/api/v2/epayment/lookup/',
      { pidx },
      {
        headers: {
          Authorization: `Key ${KHALTI_SECRET_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );
    if (response.data && response.data.status === 'Completed') {
      return { success: true, data: response.data };
    }
    return { success: false, status: response.data?.status };
  } catch (err) {
    return { success: false, error: err.response?.data || err.message };
  }
};

module.exports = { generateEsewaSignature, verifyEsewaPayment, initiateKhaltiPayment, verifyKhaltiPayment };