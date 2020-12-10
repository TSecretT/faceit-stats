// Convert snapshot to list
const getListFromSnapshot = (snapshot) => {
    let items = [];
    snapshot.forEach(item => { items.push(item.val()) })
    return items;
}
//
module.exports = { getListFromSnapshot }