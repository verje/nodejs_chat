const users = [];

function newUserData(id, username, room) {
    const userInfo = {id, username, room};
    users.push(userInfo);
    return userInfo;
}

function listUsers(room) {
    return users.filter(user => user.room === room);
}

function userLeave(id) {
    const index = users.findIndex(user => user.id === id);
  
    if (index !== -1) {
      return users.splice(index, 1)[0];
    }
  }

module.exports = {newUserData, listUsers, userLeave};