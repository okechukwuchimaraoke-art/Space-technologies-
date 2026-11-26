const C='space-v1',SHELL=['./','./index.html','./manifest.webmanifest','./icon-192.png','./icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>Promise.allSettled(SHELL.map(u=>c.add(u)))).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{const r=e.request;if(r.method!=='GET'||new URL(r.url).origin!==location.origin)return;
e.respondWith(fetch(r).then(res=>{if(res.ok){const cp=res.clone();caches.open(C).then(c=>c.put(r,cp))}return res}).catch(()=>caches.match(r).then(m=>m||caches.match('./index.html'))))});
self.addEventListener('push',e=>{let d={};try{d=e.data.json()}catch(x){}
e.waitUntil((async()=>{const cl=await self.clients.matchAll({type:'window',includeUncontrolled:true});if(cl.some(c=>c.visibilityState==='visible'))return;
await self.registration.showNotification(d.title||'SPACE',{body:d.body||'New message',icon:'./icon-192.png',badge:'./badge-96.png',tag:d.tag||'space',renotify:true,requireInteraction:!!d.call,vibrate:d.call?[400,200,400,200,400]:[120],data:{url:d.url||'./'}})})())});
self.addEventListener('notificationclick',e=>{e.notification.close();const u=new URL((e.notification.data&&e.notification.data.url)||'./',self.registration.scope).href;
e.waitUntil(self.clients.matchAll({type:'window',includeUncontrolled:true}).then(cl=>{for(const c of cl){if('focus' in c)return c.focus()}return self.clients.openWindow(u)}))});
