const express = require('express');
const router = express.Router();
const crypto = require('crypto');

router.post('/', (req, res) => {
  try {
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;
    if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
      return res.status(400).json({ success: false, message: 'Missing payment signature verification fields' });
    }

    const secret = process.env.RAZORPAY_KEY_SECRET;
    if (!secret) {
      console.error('[verifyPayment] RAZORPAY_KEY_SECRET is not configured');
      return res.status(500).json({ success: false, message: 'Payment gateway configuration error' });
    }

    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    // Use timing-safe comparison to prevent timing attacks
    const expectedBuf = Buffer.from(expectedSignature, 'utf8');
    const receivedBuf = Buffer.from(razorpay_signature, 'utf8');

    const isValid = expectedBuf.length === receivedBuf.length && crypto.timingSafeEqual(expectedBuf, receivedBuf);

    if (isValid) {
      return res.json({ success: true, message: 'Payment verified successfully' });
    }
    return res.status(400).json({ success: false, message: 'Invalid payment signature' });
  } catch (err) {
    console.error('[verifyPayment] Error:', err.message);
    return res.status(500).json({ success: false, message: 'Internal server error during verification' });
  }
});

module.exports = router;
