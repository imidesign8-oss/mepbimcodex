const map = new Map<string, {count:number,time:number}>();
export function rateLimit(key:string, limit=10, windowMs=60000){
  const now=Date.now(); const hit=map.get(key);
  if(!hit || now-hit.time>windowMs){ map.set(key,{count:1,time:now}); return true; }
  if(hit.count>=limit) return false;
  hit.count++; return true;
}
