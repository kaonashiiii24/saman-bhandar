const ChatGroup = require('../models/ChatGroup');
const { success, error } = require('../utils/apiResponse');

const getGroups = async (req, res) => {
  try {
    const groups = await ChatGroup.findGroupsByUser(req.user.id);
    return success(res, { groups });
  } catch (err) { return error(res, err.message); }
};

const getGroupMessages = async (req, res) => {
  try {
    const groupId = req.params.groupId;
    const isMember = await ChatGroup.isUserInGroup(groupId, req.user.id);
    if (!isMember) return error(res, 'Not a member of this group', 403);
    
    const messages = await ChatGroup.findGroupMessages(groupId);
    const members = await ChatGroup.findGroupMembers(groupId);
    return success(res, { messages, members });
  } catch (err) { return error(res, err.message); }
};

const sendGroupMessage = async (req, res) => {
  try {
    const { group_id, message } = req.body;
    if (!group_id || !message) return error(res, 'Group and message required', 400);
    
    const isMember = await ChatGroup.isUserInGroup(group_id, req.user.id);
    if (!isMember) return error(res, 'Not a member of this group', 403);
    
    const savedMessage = await ChatGroup.addGroupMessage(group_id, req.user.id, message);
    return success(res, { message: savedMessage }, 'Message sent', 201);
  } catch (err) { return error(res, err.message); }
};

module.exports = { getGroups, getGroupMessages, sendGroupMessage };