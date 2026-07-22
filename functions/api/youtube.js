export async function onRequestGet(context) {
  const key = context.env.YOUTUBE_API_KEY;
  const handle = context.env.YOUTUBE_HANDLE || "@GodWuBinTV";
  const json = (data,status=200)=>new Response(JSON.stringify(data),{status,headers:{"content-type":"application/json;charset=UTF-8","cache-control":"public,max-age=60"}});
  if(!key) return json({error:"Missing YOUTUBE_API_KEY"},500);
  const api="https://www.googleapis.com/youtube/v3";
  const get=async(url)=>{const r=await fetch(url);if(!r.ok)throw new Error(await r.text());return r.json()};
  try{
    const ch=await get(`${api}/channels?part=snippet,contentDetails&forHandle=${encodeURIComponent(handle)}&key=${key}`);
    const channel=ch.items?.[0]; if(!channel)return json({error:"Channel not found"},404);
    const uploads=channel.contentDetails.relatedPlaylists.uploads;
    const pl=await get(`${api}/playlistItems?part=snippet,contentDetails&playlistId=${uploads}&maxResults=30&key=${key}`);
    const ids=pl.items.map(x=>x.contentDetails.videoId).filter(Boolean);
    const details=ids.length?await get(`${api}/videos?part=snippet,contentDetails&id=${ids.join(",")}&key=${key}`):{items:[]};
    const map=new Map(details.items.map(v=>[v.id,v]));
    const all=pl.items.map(x=>map.get(x.contentDetails.videoId)).filter(Boolean).map(v=>({
      id:v.id,title:v.snippet.title,description:v.snippet.description,publishedAt:v.snippet.publishedAt,
      thumbnail:v.snippet.thumbnails.maxres?.url||v.snippet.thumbnails.high?.url||v.snippet.thumbnails.medium?.url,
      duration:v.contentDetails.duration
    }));
    const sec=d=>{const m=d.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);return m?+(m[1]||0)*3600+(m[2]||0)*60+(m[3]||0):0};
    const shorts=all.filter(v=>sec(v.duration)>0&&sec(v.duration)<=180);
    const videos=all.filter(v=>sec(v.duration)>180);
    const liveSearch=await get(`${api}/search?part=snippet&channelId=${channel.id}&eventType=live&type=video&maxResults=1&key=${key}`);
    const l=liveSearch.items?.[0];
    const live=l?{id:l.id.videoId,title:l.snippet.title,description:l.snippet.description,thumbnail:l.snippet.thumbnails.high?.url||l.snippet.thumbnails.medium?.url}:null;
    return json({videos,shorts,live});
  }catch(e){return json({error:"YouTube API request failed"},502)}
}