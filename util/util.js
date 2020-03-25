const updateData = async (Model, itemId, updateCond) => {
  const result = await Model.findOneAndUpdate({ _id: itemId }, updateCond, { new: true });
  return result;
};

module.exports = updateData;
