import cache from './cache';
const { task } = cache;


export const getServerTaskField = ({
  id,
  field = 'handleName'
}) => {
  let taskInfo = task.get(id);
  if(!taskInfo) return '';
  return taskInfo[field] || '';
}