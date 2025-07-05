// src/controllers/qrcodeController.js
const QRCode = require('qrcode');

/**
 * GET /api/qrcode
 * Query params:
 *  - text (string): data apa pun yang ingin diencode
 * Response: image/png buffer
 */
exports.generateQr = async (req, res, next) => {
  try {
    // Ambil teks dari query, default ke timestamp
    const text = req.query.text || `dummy-${Date.now()}`;

    // Generate PNG buffer
    const buffer = await QRCode.toBuffer(text, {
      type: 'png',
      width: 300,      // ukuran lebar minimal
      margin: 2        // jarak tepi
    });

    // Kirim sebagai image/png
    res.type('image/png');
    res.send(buffer);
  } catch (err) {
    next(err);
  }
};
