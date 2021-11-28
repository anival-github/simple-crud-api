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

const validatePersonProperties = ({ name, age, hobbies }, res) => {
    if (name && typeof name !== 'string') {
        res.writeHead(400, { 'Content-type': 'application/json' });
        return res.end(JSON.stringify({ message: 'Name must be of type "string"' }));
    }

    if (age && typeof age !== 'number') {
        res.writeHead(400, { 'Content-type': 'application/json' });
        return res.end(JSON.stringify({ message: 'Age must be of type "number"' }));
    }

    if (hobbies && !hobbies.every((element) => typeof element === 'string')) {
        res.writeHead(400, { 'Content-type': 'application/json' });
        return res.end(JSON.stringify({ message: 'Each hobby must be of type "string"' }));
    }
}

module.exports = {
    getPostData,
    validatePersonProperties,
}