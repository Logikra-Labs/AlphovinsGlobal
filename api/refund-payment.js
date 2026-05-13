import Razorpay from 'razorpay';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { paymentId, amount } = req.body;

    if (!paymentId) {
      return res.status(400).json({ error: 'Missing payment ID' });
    }

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    // If amount is provided, refund that specific amount (in paise), otherwise refund full amount.
    const refundOptions = {};
    if (amount) {
      refundOptions.amount = Math.round(amount * 100);
    }

    const refund = await razorpay.payments.refund(paymentId, refundOptions);

    if (!refund) {
      return res.status(500).json({ error: 'Failed to initiate refund' });
    }

    return res.status(200).json({ success: true, refund });
  } catch (error) {
    console.error('Refund Error:', error);
    return res.status(500).json({ error: error.error?.description || error.message || 'Internal Server Error' });
  }
}
