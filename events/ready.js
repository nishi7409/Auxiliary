module.exports = async client => {
    client.user.setActivity(`${client.config.prefix}help | opensource`, { type: "PLAYING" });
};