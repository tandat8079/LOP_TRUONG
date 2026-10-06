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

EventAI.summary = function(feedback) {
 const valid=feedback.filter(f=>f.comment?.trim()&&f.status==='Đã gửi');
 const unique=[...new Map(valid.map(f=>[f.comment.trim().toLowerCase(),f])).values()];
 const clean=text=>text.replace(/[\w.+-]+@[\w.-]+\.[a-z]{2,}/gi,'[email đã ẩn]').replace(/(?:\+?\d[\d .()-]{8,}\d)/g,'[số điện thoại đã ẩn]').replace(/https?:\/\/\S+/gi,'[liên kết đã ẩn]');
 const groups=[['ví dụ thực tế',/thực tế|ví dụ|case/i],['checklist',/checklist|kiểm thử/i],['thêm Q&A',/hỏi đáp|q&a|thời gian/i],['dữ liệu Việt Nam',/việt nam|dữ liệu/i]];
 const counts=groups.map(([name,re])=>({name,count:unique.filter(f=>re.test(clean(f.comment))).length})).filter(g=>g.count);
 return {text:unique.length?`Từ ${unique.length} phản hồi: ${counts.map(g=>`${g.count}/${unique.length} đề cập ${g.name}`).join('; ')||'chưa xác định chủ đề nổi bật'}. Điểm trung bình ${(unique.reduce((n,f)=>n+f.rating,0)/unique.length).toFixed(1)}/5.`:'',reason:`Loại ${valid.length-unique.length} phản hồi trùng. Nhóm theo từ khóa; một phản hồi có thể thuộc nhiều nhóm. Không suy luận danh tính.`,sources:unique.map(f=>f.id),comments:unique.map(f=>clean(f.comment))};
};
EventAI.hasTravelConflict = function(a,b,minutes=8) {
 if(a.date!==b.date)return false;
 const time=value=>Number(value.slice(0,2))*60+Number(value.slice(3,5));
 return time(a.start)<time(b.end)+minutes && time(b.start)<time(a.end)+minutes;
};
const originalRecommend=EventAI.recommend.bind(EventAI);
EventAI.recommend = function(sessions,interests,agenda,preferences={}) {
 const result=originalRecommend(sessions,interests,agenda).filter(r=>(!preferences.date||r.session.date===preferences.date)&&(!preferences.start||r.session.start>=preferences.start)&&(!preferences.end||r.session.end<=preferences.end)&&!agenda.some(a=>this.hasTravelConflict(a,r.session)));
 const selected=[];for(const item of result)if(!selected.some(a=>this.hasTravelConflict(a.session,item.session)))selected.push(item);
 return selected;
};
