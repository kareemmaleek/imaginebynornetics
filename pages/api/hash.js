export default function hash(req, res) {
  
    const token2 = require('crypto')
    const generated = token2.randomUUID().toString()
    
    return res.send(generated)

}
