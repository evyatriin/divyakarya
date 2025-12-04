module.exports = (req, res) => {
    res.status(200).json({
        message: 'Debug endpoint working',
        env: process.env.NODE_ENV,
        time: new Date().toISOString()
    });
};
