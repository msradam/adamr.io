import sharp from 'sharp'; import fs from 'node:fs';
// A screencast's first frame is an empty terminal. Walk the animation and keep
// the frame with the most going on, so the thumbnail shows the tool working.
const GIFS = {theodosia:'public/images/theodosia.gif', fromjcl:'public/images/fromjcl.gif',
              'xk6-tn3270':'public/images/locust-zos.gif'};
for (const [k,src] of Object.entries(GIFS)) {
  const meta = await sharp(src,{animated:true}).metadata();
  const frames = meta.pages || 1, h = meta.pageHeight || meta.height;
  let best={i:0,sd:-1};
  for (let i=0;i<Math.min(frames,40);i++){
    const idx=Math.floor(i*frames/Math.min(frames,40));
    const buf=await sharp(src,{page:idx}).toBuffer();
    const st=await sharp(buf).stats();
    const sd=st.channels.reduce((a,c)=>a+c.stdev,0)/st.channels.length;
    if (sd>best.sd) best={i:idx,sd};
  }
  const out=`public/images/thumbs/${k}.webp`;
  await sharp(src,{page:best.i}).resize({width:640,withoutEnlargement:true}).webp({quality:80,effort:5}).toFile(out);
  console.log(`  ${k.padEnd(14)} frame ${String(best.i).padStart(3)}/${frames}  stdev ${best.sd.toFixed(0)}  ${(fs.statSync(out).size/1024).toFixed(0)} KB`);
}
