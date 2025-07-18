export default function handler(req, res) {
  // Enable CORS (optional, but helpful for testing from browser or frontend)
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === 'GET') {
    return res.status(200).json({
      success: true,
      message: "Discord Auth API working correctly!",
      timestamp: new Date().toISOString()
    });
  }

  // Handle unsupported methods
  res.status(405).json({
    success: false,
    error: "Method Not Allowed",
  });
}
