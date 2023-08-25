let generateMessage = ({from,text}) => {
return {
    from,
    text,
    createdAt : new Date().getTime()
}
}
let isRealString = str => typeof str === 'string' && str.trim().length > 0

module.exports = {
    generateMessage,
    isRealString
}