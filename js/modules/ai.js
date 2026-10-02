/* Deterministic AI simulation. Every output explains its data and limitations. */
window.EventAI = {
 overlap(a,b) { return a.date===b.date && a.start < b.end && b.start < a.end; },
 conflicts(sessions) {
  return sessions.flatMap((a,i)=>sessions.slice(i+1).filter(b=>this.overlap(a,b)).map(b=>[a,b]));
 },
 recommend(sessions, interests, agenda) {
  const terms=interests.toLocaleLowerCase('vi').split(/[,;\s]+/).filter(Boolean);
  return sessions.filter(s=>!agenda.some(a=>a.id===s.id) && s.booked<s.capacity && s.status!=='Đã hủy')
   .map(s=>({session:s,score:terms.filter(t=>(s.topic+' '+s.title).toLocaleLowerCase('vi').includes(t)).length,conflict:agenda.some(a=>this.overlap(a,s))}))
   .filter(r=>r.score>0 && !r.conflict).sort((a,b)=>b.score-a.score);
 },
 resolve(sessions) {
  const accepted=[],removed=[];
  [...sessions].sort((a,b)=>a.start.localeCompare(b.start)).forEach(s=>(accepted.some(a=>this.overlap(a,s))?removed:accepted).push(s));
  return {accepted,removed};
 },
 forecast(sessions) {
  return sessions.filter(s=>s.status!=='Đã hủy').map(s=>{
   const predicted=Math.round(s.booked*.7+s.saves*.4+s.feedbackCount*.3);
   return {session:s,predicted,ratio:predicted/s.capacity,confidence:s.feedbackCount>=10?'Trung bình':'Thấp',reason:`${s.booked} lượt đặt, ${s.saves} lượt quan tâm và ${s.feedbackCount} phản hồi. Công thức mô phỏng: đặt × 0,7 + quan tâm × 0,4 + phản hồi × 0,3.`};
  }).sort((a,b)=>b.ratio-a.ratio);
 }
};
