import fs from 'node:fs';
import { gzipSync } from 'node:zlib';
import { chromium } from '@playwright/test';

const browser=await chromium.launch({channel:'msedge'});
const measurements=[];
try {
  for(const route of ['/','/demo?guided=1','/demo/reels?profile=food&reel=2','/play/quiz?interest=food&seed=reel-demo','/learn/metabolism','/learn/glp1']){ for(let run=1;run<=3;run++){
    const context=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true,reducedMotion:'reduce'});
    const page=await context.newPage();const cdp=await context.newCDPSession(page);
    await cdp.send('Network.enable');await cdp.send('Network.setCacheDisabled',{cacheDisabled:true});
    await cdp.send('Network.emulateNetworkConditions',{offline:false,latency:150,downloadThroughput:200000,uploadThroughput:93750});
    await cdp.send('Emulation.setCPUThrottlingRate',{rate:4});
    await page.addInitScript(()=>{
      window.__audit={lcpMs:null,cls:0};
      new PerformanceObserver(list=>{for(const entry of list.getEntries())window.__audit.lcpMs=entry.startTime;}).observe({type:'largest-contentful-paint',buffered:true});
      new PerformanceObserver(list=>{for(const entry of list.getEntries())if(!entry.hadRecentInput)window.__audit.cls+=entry.value;}).observe({type:'layout-shift',buffered:true});
    });
    const failed=[];page.on('requestfailed',request=>failed.push({url:request.url(),error:request.failure()?.errorText}));
    await page.goto('http://localhost:4173'+route,{waitUntil:'domcontentloaded',timeout:30000});await page.locator('h1').waitFor();
    await page.waitForTimeout(5000); // Fixed observation window, not a Lighthouse score.
    const result=await page.evaluate(()=>{
      const resources=performance.getEntriesByType('resource');const navigation=performance.getEntriesByType('navigation')[0];
      return {...window.__audit,domContentLoadedMs:navigation.domContentLoadedEventEnd,observationMs:performance.now(),jsBytes:resources.filter(r=>r.name.endsWith('.js')).reduce((sum,r)=>sum+r.encodedBodySize,0),jsRequests:resources.filter(r=>r.name.endsWith('.js')).length,fonts:document.fonts.status};
    });
    measurements.push({route,run,...result,failedRequests:failed});console.log(`${route} [${run}/3]: LCP ${Math.round(result.lcpMs??0)} ms; CLS ${result.cls.toFixed(4)}`);await context.close();
  }}
  const files=fs.readdirSync('dist/assets').filter(f=>f.endsWith('.js')).map(file=>({file,gzipBytes:gzipSync(fs.readFileSync('dist/assets/'+file)).byteLength}));
  fs.mkdirSync('docs/evidence',{recursive:true});fs.writeFileSync('docs/evidence/performance.json',JSON.stringify({date:'2026-10-18',method:'Edge headless, cold context and cache disabled; 390×844 touch viewport; 4× CPU slowdown; 150 ms latency, 200,000 bytes/s download, 93,750 bytes/s upload; localhost production preview; five-second observation after h1; three runs per route, all samples retained. Browser observer metrics, NOT Lighthouse or field data.',lighthouse:'Unavailable: not installed; npm download failed with EACCES in the restricted environment. Scores unverified.',measurements,bundles:files},null,2)+'\n');
}finally{await browser.close();}
