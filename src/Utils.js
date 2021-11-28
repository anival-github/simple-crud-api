const getPostData = (req, res) => {
    return new Promise((resolve, reject) => {
        try {
            let body = '';

            req.on('data', (chunk) => {
                body += chunk.toString();
            })

            req.on('end', () => {
                try {
                    resolve(JSON.parse(body));
                } catch (error) {
                    res.writeHead(500, { 'Content-Type': 'application/json' })
                    res.end(JSON.stringify({ message: error.message }))
                }
            })
        } catch (error) {
            res.writeHead(500, { 'Content-Type': 'application/json' })
            res.end(JSON.stringify({ message: error.message }))
        }
    });
}

module.exports = {
    getPostData,
}