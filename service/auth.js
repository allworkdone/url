const sessiToUserMap = new Map();

function setUser (id, user) {
  sessiToUserMap.set(id, user);
}

function getUser (id) {
  return sessiToUserMap.get(id);
}

module.exports = {
    setUser,
    getUser,
    };